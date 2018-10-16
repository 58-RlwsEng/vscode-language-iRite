call deploy.bat
echo. 
Title RELEASE %Project%
echo. 
SET BROWSER=chrome.exe
SET WAIT_TIME=2
start "" chrome --app=http://github.com/58-RlwsEng/vscode-language-iRite/releases
echo. 
for /F "delims=" %%A in (Comment.txt) do set %%A
set /p Tag= Enter Tag: 
echo ^#^#^#^# %Tag%>>"readme.md"
echo     * %Comment%>>"readme.md"
set /p Prerelease= Prerelease?(true or false): 
git add --all
git commit -am "%Tag% %Comment%"
git push -u origin master
echo. 
git commit -am "ReadMe"
git push -u origin master
curl -u 58-RlwsEng:Rlws2349171 --data "{\"tag_name\": \"V.%Tag%\",\"target_commitish\": \"master\",\"name\": \"%Tag%\",\"body\": \"Release of version %Tag%. %comment% \",\"draft\": false,\"prerelease\": %Prerelease%}"  http://github.com/api/v3/repos/58-RlwsEng/vscode-language-iRite/releases
echo.
git push -u origin master -f
echo. 
echo %Tag% %comment%>>" CN.customer"
echo. 
echo. 
del comment.txt
echo. 
echo. 
echo. 
echo Release complete.  Press Any Key.
taskkill /fi "WindowTitle eq Releases*"
pause >nul
start "" chrome --app=http://github.com/58-RlwsEng/vscode-language-iRite/releases
echo Ensure Correct Version Shown
pause >nul
taskkill /fi "WindowTitle eq Releases*"
