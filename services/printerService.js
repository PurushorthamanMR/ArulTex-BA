const net = require('net');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');
const logger = require('../config/logger');

const execFileAsync = promisify(execFile);

function getPrinterAddress() {
  const host = process.env.ZEBRA_HOST || process.env.PRINTER_HOST || '';
  const port = Number(process.env.ZEBRA_PORT || process.env.PRINTER_PORT || 9100);
  return { host: host.trim(), port: Number.isFinite(port) && port > 0 ? port : 9100 };
}

function getWindowsPrinterName() {
  return (process.env.ZEBRA_WINDOWS_PRINTER || process.env.WINDOWS_PRINTER_NAME || '').trim();
}

function getWindowsPrinterPort() {
  return (process.env.ZEBRA_WINDOWS_PORT || '').trim();
}

/**
 * Resolve spooler printer name: explicit ZEBRA_WINDOWS_PRINTER, or lookup by port (e.g. USB001) via Get-Printer.
 */
async function resolveWindowsPrinterName() {
  const explicit = getWindowsPrinterName();
  if (explicit) {
    return explicit;
  }

  const portName = getWindowsPrinterPort();
  if (!portName) {
    return null;
  }
  if (process.platform !== 'win32') {
    return null;
  }

  const safe = portName.replace(/'/g, "''");
  const { stdout } = await execFileAsync(
    'powershell.exe',
    [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      `(Get-Printer | Where-Object { $_.PortName -eq '${safe}' }).Name | Select-Object -First 1`
    ],
    { timeout: 15000, windowsHide: true }
  );
  const name = (stdout || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) => s.length > 0);
  if (!name) {
    throw new Error(
      `No printer found on Windows port "${portName}". Check Printers → Printer properties → Ports, or run: Get-Printer | Format-Table Name, PortName`
    );
  }
  logger.info('Resolved ZEBRA_WINDOWS_PORT=%s to printer name "%s"', portName, name);
  return name;
}

function shouldUseWindowsSpooler() {
  if (process.platform !== 'win32') {
    return false;
  }
  return !!(getWindowsPrinterName() || getWindowsPrinterPort());
}

/**
 * USB / Windows: send RAW bytes via the spooler (driver must be installed; name from Settings → Printers).
 */
async function sendRawToWindowsPrinter(payload, encoding = 'utf8') {
  let printerName;
  try {
    printerName = await resolveWindowsPrinterName();
  } catch (e) {
    return Promise.reject(e);
  }
  if (!printerName) {
    return Promise.reject(
      new Error(
        'Set ZEBRA_WINDOWS_PRINTER (exact name) or ZEBRA_WINDOWS_PORT (e.g. USB001 from Printer properties → Ports).'
      )
    );
  }
  if (process.platform !== 'win32') {
    return Promise.reject(new Error('Windows spooler printing is only supported on Windows.'));
  }

  const body = typeof payload === 'string' ? Buffer.from(payload, encoding) : payload;
  const tmp = path.join(
    os.tmpdir(),
    `arultex-raw-${Date.now()}-${Math.random().toString(36).slice(2)}.prn`
  );
  const scriptPath = path.join(__dirname, '..', 'scripts', 'raw-print-windows.ps1');

  fs.writeFileSync(tmp, body);

  try {
    await execFileAsync(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
        '-PrinterName',
        printerName,
        '-FilePath',
        tmp
      ],
      { timeout: 60000, windowsHide: true }
    );
    logger.info('Printer: sent RAW via Windows spooler (%d bytes) to "%s"', body.length, printerName);
    return { transport: 'windows-spooler', printer: printerName, bytes: body.length };
  } catch (err) {
    const msg = err.stderr?.toString() || err.message || String(err);
    logger.error('Windows raw print failed: %s', msg);
    throw new Error(
      `Windows print failed: ${msg.trim()}. Check ZEBRA_WINDOWS_PRINTER matches the name in "Printers & scanners" exactly (EPL/ZPL driver).`
    );
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Network printer: raw TCP (usually port 9100).
 */
function sendRawToTcpPrinter(payload, encoding = 'utf8') {
  const { host, port } = getPrinterAddress();
  if (!host) {
    return Promise.reject(
      new Error(
        'No printer configured. On Windows USB set ZEBRA_WINDOWS_PORT=USB001 or ZEBRA_WINDOWS_PRINTER="exact name". For network printing set ZEBRA_HOST (and optional ZEBRA_PORT).'
      )
    );
  }

  const body = typeof payload === 'string' ? Buffer.from(payload, encoding) : payload;

  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host, port }, () => {
      client.write(body, (err) => {
        if (err) {
          client.destroy();
          return reject(err);
        }
        client.end();
      });
    });

    const t = setTimeout(() => {
      client.destroy();
      reject(new Error('Printer connection timeout'));
    }, 20000);

    client.on('error', (e) => {
      clearTimeout(t);
      reject(e);
    });
    client.on('close', () => {
      clearTimeout(t);
      resolve({ transport: 'tcp', host, port, bytes: body.length });
    });
  });
}

/**
 * Send raw label data (ZPL, EPL). Prefers Windows spooler when ZEBRA_WINDOWS_PRINTER or ZEBRA_WINDOWS_PORT is set.
 */
async function sendRawToPrinter(payload, encoding = 'utf8') {
  if (shouldUseWindowsSpooler()) {
    return sendRawToWindowsPrinter(payload, encoding);
  }
  return sendRawToTcpPrinter(payload, encoding);
}

async function printZpl(zpl) {
  if (zpl == null || String(zpl).trim() === '') {
    throw new Error('Empty ZPL payload');
  }
  logger.info('Printer: sending ZPL (%d bytes)', Buffer.byteLength(String(zpl), 'utf8'));
  return sendRawToPrinter(String(zpl), 'utf8');
}

async function printEpl(epl) {
  if (epl == null || String(epl).trim() === '') {
    throw new Error('Empty EPL payload');
  }
  logger.info('Printer: sending EPL (%d bytes)', Buffer.byteLength(String(epl), 'utf8'));
  return sendRawToPrinter(String(epl), 'utf8');
}

module.exports = {
  getPrinterAddress,
  getWindowsPrinterName,
  getWindowsPrinterPort,
  resolveWindowsPrinterName,
  sendRawToPrinter,
  sendRawToWindowsPrinter,
  printZpl,
  printEpl
};
