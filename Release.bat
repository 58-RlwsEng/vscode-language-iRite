call deploy.bat
Title RELEASE Enterprise
echo. 
SET BROWSER=chrome.exe
SET WAIT_TIME=2
start "" chrome --app=http://github.corp.rlws.com/api/v3/repos/RiceLake-Engineering/vscode_irite/releases
echo. 
for /F "delims=" %%A in (Comment.txt) do set %%A
set /p Tag= Enter Tag: 
echo ^#^#^#^# %Tag%>>"readme.md"
echo     * %Comment%>>"readme.md"
set /p Prerelease= Prerelease?(true or false): 
git add --all
git commit -am "%Tag% %Comment%"
git remote remove origin
git remote add origin http://github.corp.rlws.com/RiceLake-Engineering/vscode_irite.git
REM git push -u origin master
echo. 
git commit -am "ReadMe"
git push -u origin master
curl -u kylegg:eczqiofw --data "{\"tag_name\": \"V.%Tag%\",\"target_commitish\": \"master\",\"name\": \"%Tag%\",\"body\": \"Release of version %Tag%. %comment% \",\"draft\": false,\"prerelease\": %Prerelease%}" http://github.corp.rlws.com/api/v3/repos/RiceLake-Engineering/vscode_irite/releases
echo.
REM git push -u origin master
del comment.txt
echo. 
echo Release complete.  Press Any Key.
taskkill /fi "WindowTitle eq Releases*"
pause >nul
start "" chrome --app=http://github.corp.rlws.com/api/v3/repos/RiceLake-Engineering/vscode_irite/releases
echo Ensure Correct Version Shown
pause >nul
taskkill /fi "WindowTitle eq Releases*"