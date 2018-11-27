// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
//import * as builder from './build'; //removed until language server build starts
import fs = require("fs");
import path = require("path");
import cp = require("child_process");
var opener = require("opener");
var iRiteChannel = vscode.window.createOutputChannel("iRite Information");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  interface EngineParams {
    engine: string;
    enginePath: string;
  }

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Congratulations, iRite is now active!");

  //check to see if the .exe is in specified path, if not display message to download revolution
  let enginePath: string = vscode.workspace
    .getConfiguration("irite")
    .get("build.enginePath", "");
  var optionRev = <vscode.MessageItem>{ title: "Get Revolution" };

  fs.stat(enginePath, function (err, stat) {
    if (err == null) {
      console.log("Revolution exists");
    } else if (err.code == "ENOENT") {
      // file does not exist
      vscode.window
        .showInformationMessage(
          "Revolution can not be located, would you like to download it?",
          optionRev
        )
        .then(option => {
          if (typeof option == "undefined") {
            return;
          }
          switch (option.title) {
            case optionRev.title:
              opener(
                "https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/resources-downloads"
              );
              break;
            default:
              break;
          }
        });
    } else {
      console.log("Revolution Checker: ", err.code);
    }
  });

  //shows iRite output on seperate debug output channel
  iRiteChannel.clear;
  iRiteChannel.show();

  //registercommands takes reference from package.json, alter that file for more/different commands
  vscode.commands.registerCommand("irite.build", () => {
    iRiteChannel.appendLine("Build Started");
    vscode.workspace.saveAll().then(
      success => {
        if (success) {
          iRiteChannel.appendLine("\nAll Files Saved");
          vscode.workspace.findFiles("*.src", "system.src", 1).then(
            result => {
              if (result.length > 0) {
                {
                  iRiteChannel.appendLine(result[0].fsPath.toString() + " src File in Workspace");
                  var openTextDoc = vscode.workspace.openTextDocument(result[0]);
                  openTextDoc.then(srcFile => {
                    iRiteChannel.appendLine("fsPath: " + result[0].fsPath);
                    iRiteChannel.appendLine(srcFile.fileName + " Opened");
                    vscode.window.showTextDocument(srcFile).then(srcEditor => {
                      iRiteChannel.appendLine("src File Active");
                      checkEngineDefined().then(engineType => {
                        checkEnginePathDefined(engineType.toString()).then(engineParameters => {
                          //got engine path and compiler from config, now init active window and push to iRiteProcessor
                          //iRiteProcessor takes argument of desired .src file path
                          let enginePath: string = vscode.workspace
                            .getConfiguration("irite")
                            .get("build.enginePath", "");
                          iRiteChannel.append("Engine Path: " + enginePath + "\n");
                          let compilerPath: string = vscode.workspace
                            .getConfiguration("irite")
                            .get("build.compilerPath", "");
                            iRiteChannel.append("Compiler Path: " + compilerPath + "\n");
                          let textEditor = vscode.window.activeTextEditor;
                          iRiteChannel.append(
                            "*************************************\n" +
                            "Building: " +
                            textEditor.document.fileName +
                            "\n*************************************\n"
                          );

                          let filepath = textEditor.document.fileName;
                          var path = enginePath;
                          iRiteChannel.append("Path: " + path.toString() + "\n");

                          cp.execFile(
                            path,
                            [filepath, compilerPath, "build"],
                            function (error, data, stderr) {
                              if (stderr != null) {
                                console.log(error);
                                console.log(stderr);
                              }
                            }
                          );
                        })
                          .catch(error => {
                            vscode.window.setStatusBarMessage("Error 112: " + error, 5000)
                            vscode.window.showErrorMessage("Open Folder to Build Properly");
                            iRiteChannel.appendLine("Error 114:  checkEnginePathDefined: " + error);
                          });
                      })
                        .catch(error => {
                          vscode.window.showErrorMessage("Error 118: " + error);
                          vscode.window.setStatusBarMessage("Error 119:  + checkEngineDefined: " + error, 5000);
                          iRiteChannel.appendLine("Error 120: checkEngineDefined: " + error);
                        });
                    },
                      err => {
                        vscode.window.showErrorMessage("Error 124: " + err);
                        vscode.window.setStatusBarMessage("Error 125: " + err, 5000);
                        iRiteChannel.appendLine("Error 126: " + err);
                      }
                    );
                  },
                    err => {
                      vscode.window.showErrorMessage("Error 136: Invalid Workspace.  Please open folder/workspace and rebuild | ");
                      iRiteChannel.appendLine("Error 137: Invalid Workspace.  Please open folder/workspace and rebuild");
                      vscode.window.setStatusBarMessage("Error 138: Invalid Workspace.  Please open folder/workspace and rebuild | ", 5000);
                    }
                  )
                }
              } else {
                vscode.window.showErrorMessage("Error 140: Invalid Workspace.  Please open folder/workspace and rebuild");
                iRiteChannel.appendLine(
                  "\n***********************************************************************************" +
                  "\n********* Invalid Workspace.  Please open folder / workspace and rebuild **********" +
                  "\n***********************************************************************************\n"
                );
              }
            },
            reason => {
              vscode.window.showErrorMessage(reason + "\nMust have Workspace Open to compile!\n\n");
              iRiteChannel.appendLine("Must have Workspace Open to Compile!");
              vscode.window.setStatusBarMessage(reason + "\nMust have Workspace Open to compile!\n\n");

            }
          );
        } else {
          vscode.window.setStatusBarMessage("Error Saving Files SBMsg", 5000);
          vscode.window.showErrorMessage("Error Saving Files EM");
          iRiteChannel.append(
            "\n\n*************************************\nError Saving Files.  Rectify and rebuild.\n*************************************\n\n"
          );
        }
      },
      reason => {
        vscode.window.showErrorMessage(reason + "\nUnable to Save!\n\n");
        vscode.window.setStatusBarMessage(reason + "\nUnable to Save!\n\n");
        iRiteChannel.append(
          "*************************************\n" +
          "*************************************\n" +
          "Unable to Save!" +
          "*************************************\n" +
          "*************************************\n"
        );
        iRiteChannel.append("\nError 171: Please open folder(workspace).\n");
      }
    );
  });

  //registercommands takes reference from package.json, alter that file for more/different commands
  vscode.commands.registerCommand("irite.deploy", () => {
    // vscode.commands.executeCommand("irite.build");  // WOrry about this later :)
    checkEngineDefined()
      .then(engineType => {
        checkEnginePathDefined(engineType.toString())
          .then(engineParameters => {
            //got engine path and compiler from config, now init active window and push to iRiteProcessor
            //iRiteProcessor takes argument of desired .src file path
            let enginePath: string = vscode.workspace
              .getConfiguration("irite")
              .get("build.enginePath", "");
            let compilerPath: string = vscode.workspace
              .getConfiguration("irite")
              .get("build.compilerPath", "");
            let textEditor = vscode.window.activeTextEditor;
            iRiteChannel.append(
              "*************************************\n" +
              "*************************************\n" +
              "iRite Deploying: " +
              textEditor.document.fileName +
              "\n"
            );
            let filepath = textEditor.document.fileName;
            var path = enginePath;

            cp.execFile(path, [filepath, compilerPath, "deploy"], function (
              error,
              data,
              stderr
            ) {
              if (stderr != null) {
                console.log(error);
                console.log(stderr);
              }
              iRiteChannel.append(data);
            });
          })
          .catch(error => {
            vscode.window.showErrorMessage(error);
            iRiteChannel.appendLine(error);
          });
      })
      .catch(error => {
        vscode.window.setStatusBarMessage("checkEngineDefined: " + error, 5000);
        iRiteChannel.appendLine("checkEngineDefined: " + error);
      });
  });

  function checkEngineDefined() {
    return new Promise((resolve, reject) => {
      let engineType: string = vscode.workspace
        .getConfiguration("irite")
        .get("build.engine", "");
      if (engineType == "") {
        var optionRev = <vscode.MessageItem>{
          title: "revolution"
        };
        var optionTest = <vscode.MessageItem>{
          title: "Test"
        };
        vscode.window
          .showErrorMessage(
            'The "irite.build.engine" setting is not defined. Do you want to download Revolution?',
            optionRev,
            optionTest
          )
          .then(option => {
            // nothing selected
            if (typeof option == "undefined") {
              reject("undefined");
              return;
            }
            switch (option.title) {
              case optionRev.title:
                opener(
                  "https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/resources-downloads"
                );
                break;
              case optionTest.title:
                opener("http://www.ricelake.com");
                break;
              default:
                break;
            }
            reject("hyperlink");
          });
      } else {
        resolve(engineType);
      }
    });
  }

  function checkEnginePathDefined(engine: string) {
    return new Promise((resolve, reject) => {
      let enginePath: string = vscode.workspace
        .getConfiguration("irite")
        .get("build.enginePath", "");
      if (enginePath == "") {
        reject(
          'The "irite.build.enginePath" setting is not defined. Please configure.'
        );
        return;
      }
      resolve(enginePath);
    });
  }
}
