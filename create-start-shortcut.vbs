' Run once: creates "Start ArulTex POS.lnk" with logo.ico (Windows cannot set an icon on .bat files).
Set fso = CreateObject("Scripting.FileSystemObject")
Set ws = CreateObject("WScript.Shell")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
icoPath = scriptDir & "\logo.ico"
If Not fso.FileExists(icoPath) Then
  WScript.Echo "Missing: " & icoPath
  WScript.Quit 1
End If
Set sc = ws.CreateShortcut(scriptDir & "\Start ArulTex POS.lnk")
sc.TargetPath = scriptDir & "\start-app.bat"
sc.WorkingDirectory = scriptDir
sc.IconLocation = icoPath & ",0"
sc.Description = "ArulTex POS - API, Vite, Chrome"
sc.Save
WScript.Echo "Created: Start ArulTex POS.lnk - pin or use that shortcut for the logo icon."
