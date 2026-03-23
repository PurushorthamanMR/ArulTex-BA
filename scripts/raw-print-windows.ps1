# Sends a file as a RAW print job to a Windows printer (USB, network share, or WSD — driver must be installed).
# Usage: powershell -File raw-print-windows.ps1 -PrinterName "ZDesigner ZTC GT800 (EPL)" -FilePath "C:\path\to\job.prn"
param(
    [Parameter(Mandatory = $true)]
    [string] $PrinterName,
    [Parameter(Mandatory = $true)]
    [string] $FilePath
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $FilePath)) {
    throw "File not found: $FilePath"
}
$bytes = [System.IO.File]::ReadAllBytes($FilePath)
if ($bytes.Length -eq 0) {
    throw 'Empty print file'
}

$typeDef = @'
using System;
using System.Runtime.InteropServices;
public static class ArulTexRawPrint {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public class DOCINFO {
        [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
        [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
        [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
    }
    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = false, CallingConvention = CallingConvention.StdCall)]
    public static extern bool OpenPrinter(string pPrinterName, out IntPtr phPrinter, IntPtr pDefault);
    [DllImport("winspool.drv", ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool ClosePrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", CharSet = CharSet.Unicode, ExactSpelling = false, CallingConvention = CallingConvention.StdCall)]
    public static extern bool StartDocPrinter(IntPtr hPrinter, int level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFO di);
    [DllImport("winspool.drv", ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool EndDocPrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool StartPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool EndPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
    public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);

    public static void SendRaw(string printerName, byte[] data) {
        IntPtr h = IntPtr.Zero;
        if (!OpenPrinter(printerName, out h, IntPtr.Zero)) {
            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "OpenPrinter failed for: " + printerName);
        }
        try {
            DOCINFO di = new DOCINFO();
            di.pDocName = "ArulTex";
            di.pOutputFile = null;
            di.pDataType = "RAW";
            if (!StartDocPrinter(h, 1, di)) {
                throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "StartDocPrinter failed");
            }
            try {
                if (!StartPagePrinter(h)) {
                    throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "StartPagePrinter failed");
                }
                try {
                    IntPtr p = Marshal.AllocCoTaskMem(data.Length);
                    try {
                        Marshal.Copy(data, 0, p, data.Length);
                        int written;
                        if (!WritePrinter(h, p, data.Length, out written)) {
                            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "WritePrinter failed");
                        }
                    } finally {
                        Marshal.FreeCoTaskMem(p);
                    }
                } finally {
                    if (!EndPagePrinter(h)) {
                        throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "EndPagePrinter failed");
                    }
                }
            } finally {
                if (!EndDocPrinter(h)) {
                    throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error(), "EndDocPrinter failed");
                }
            }
        } finally {
            ClosePrinter(h);
        }
    }
}
'@

Add-Type -TypeDefinition $typeDef -ErrorAction Stop
[ArulTexRawPrint]::SendRaw($PrinterName, $bytes)
