
'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
//import * as builder from './build'; //removed until language server build starts
import fs = require("fs");
import path = require("path");
import cp = require("child_process");
// import { commands, Disposable, ExtensionContext, TextEditor, window } from 'vscode';
// import { ActiveEditorTracker } from './activeEditorTracker';
// import { TextEditorComparer } from './comparers';
// import { WorkspaceState } from './constants';
// import { Logger } from './logger';
// import { ISavedEditor, SavedEditor } from './savedEditor';

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

  fs.stat(enginePath, function(err, stat) {
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

  //registercommands takes reference from package.json, alter that file for more/different commands
  vscode.commands.registerCommand("irite.build", () => {
    iRiteChannel.clear();
    vscode.workspace.saveAll().then(
      success => {
        if (success) {
          iRiteChannel.appendLine("All Files Saved");

          var openTextDoc: vscode.TextDocument;

          // async function save () {
          //   try {
          //     const editorTracker = new ActiveEditorTracker();

          //     let active = window.activeTextEditor;
          //     let editor = active;
          //     const openEditors: TextEditor[] = [];
          //     do {
          //         if (editor != null) {
          //             // If we didn't start with a valid editor, set one once we find it
          //             if (active === undefined) {
          //                 active = editor;
          //             }

          //             openEditors.push(editor);
          //         }

          //         editor = await editorTracker.awaitNext(500);
          //         if (editor !== undefined && openEditors.some(_ => TextEditorComparer.equals(_, editor, { useId: true, usePosition: true }))) break;
          //     } while ((active === undefined && editor === undefined) || !TextEditorComparer.equals(active, editor, { useId: true, usePosition: true }));

          //       editorTracker.dispose();

          //       const editors = openEditors
          //           .filter(_ => _.document !== undefined)
          //           .map(_ => {
          //               return {
          //                   uri: _.document.uri,
          //                   viewColumn: _.viewColumnnp
          //               } as ISavedEditor;
          //           });

          //       this.context.workspaceState.update(WorkspaceState.SavedDocuments, editors);
          //   }
          //   catch (ex) {
          //       Logger.error(ex, 'DocumentManager.save');
          //   }
          // }


          openTextDoc = vscode.window.activeTextEditor.document;
          iRiteChannel.appendLine("Open File: " + openTextDoc.fileName);

          iRiteChannel.show();
          vscode.window.showTextDocument(openTextDoc).then(srcEditor => {
            checkEngineDefined().then(engineType => {
              checkEnginePathDefined(engineType.toString()).then(engineParameters => {
                //got engine path and compiler from config, now init active window and push to iRiteProcessor
                //iRiteProcessor takes argument of desired .src file path
                let enginePath: string = vscode.workspace
                  .getConfiguration("irite")
                  .get("build.enginePath", "");
                let compilerPath: string = vscode.workspace
                  .getConfiguration("irite")
                  .get("build.compilerPath", "");
                let filepath = openTextDoc.fileName;
                iRiteChannel.appendLine("Building: " + filepath);

                var path = enginePath;

                cp.execFile(
                  path,
                  [filepath, compilerPath, "build"],
                  function (error, data, stderr) {
                    if (error != null) {
                      iRiteChannel.appendLine("Compile Function ERROR: " + error + "  stderr:" + stderr + "|");
                      console.log(error);
                      console.log(stderr);
                    }else{
                      iRiteChannel.appendLine(data);
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