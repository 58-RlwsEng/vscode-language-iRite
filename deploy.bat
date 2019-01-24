Title DEPLOY VSCode_iRite
setlocal enabledelayedexpansion
start changelog.md 
git init
git add --all
set /p comment= Enter Comment:
git commit -am "%comment%"
echo comment=%comment%>"Comment.txt"
git remote remove origin
git remote add origin http://github.corp.rlws.com/RiceLake-Engineering/vscode_irite.git
git pull origin master
git push -u origin master
echo Private Deploy Complete. Press Any Key to Continue
pause >nul