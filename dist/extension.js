module.exports=function(e){var n={};function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(o,i,function(n){return e[n]}.bind(null,i));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=1)}([function(e,n){e.exports=require("child_process")},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.activate=void 0;const o=t(2),i=t(3),r=t(0);var a=t(4),s=o.window.createOutputChannel("iRite Information");n.activate=function(e){console.log("Congratulations, iRite is now active!");let n=o.workspace.getConfiguration("irite").get("build.enginePath","");var t={title:"Get Revolution"};function l(){return new Promise((e,n)=>{let t=o.workspace.getConfiguration("irite").get("build.engine","");if(""==t){var i={title:"revolution"},r={title:"Test"};o.window.showErrorMessage('The "irite.build.engine" setting is not defined. Do you want to download Revolution?',i,r).then(e=>{if(void 0!==e){switch(e.title){case i.title:a("https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/resources-downloads");break;case r.title:a("http://www.ricelake.com")}n("hyperlink")}else n("undefined")})}else e(t)})}function c(e){return new Promise((e,n)=>{let t=o.workspace.getConfiguration("irite").get("build.enginePath","");""!=t?e(t):n('The "irite.build.enginePath" setting is not defined. Please configure.')})}i.stat(n,(function(e,n){null==e?console.log("Revolution exists"):"ENOENT"==e.code?o.window.showInformationMessage("Revolution can not be located, would you like to download it?",t).then(e=>{if(void 0!==e)switch(e.title){case t.title:a("https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/resources-downloads")}}):console.log("Revolution Checker: ",e.code)})),o.commands.registerCommand("irite.build",()=>{s.clear(),o.workspace.saveAll().then(e=>{var n;e?(s.appendLine("All Files Saved"),n=o.window.activeTextEditor.document,s.appendLine("Open File: "+n.fileName),s.show(),o.window.showTextDocument(n).then(e=>{l().then(e=>{c(e.toString()).then(e=>{let t=o.workspace.getConfiguration("irite").get("build.enginePath",""),i=o.workspace.getConfiguration("irite").get("build.compilerPath",""),a=n.fileName;s.appendLine("Building: "+a);var l=t;r.execFile(l,[a,i,"build"],(function(e,n,t){null!=e?(s.appendLine("Compile Function ERROR: "+e+"  stderr:"+t+"|"),console.log(e),console.log(t)):s.appendLine(n)}))}).catch(e=>{o.window.setStatusBarMessage("Error 112: "+e,5e3),o.window.showErrorMessage("Open Folder to Build Properly"),s.appendLine("Error 114:  checkEnginePathDefined: "+e)})}).catch(e=>{o.window.showErrorMessage("Error 118: "+e),o.window.setStatusBarMessage("Error 119:  + checkEngineDefined: "+e,5e3),s.appendLine("Error 120: checkEngineDefined: "+e)})},e=>{o.window.showErrorMessage("Error 124: "+e),o.window.setStatusBarMessage("Error 125: "+e,5e3),s.appendLine("Error 126: "+e)})):(o.window.setStatusBarMessage("Error Saving Files SBMsg",5e3),o.window.showErrorMessage("Error Saving Files EM"),s.append("\n\n*************************************\nError Saving Files.  Rectify and rebuild.\n*************************************\n\n"))},e=>{o.window.showErrorMessage(e+"\nUnable to Save!\n\n"),o.window.setStatusBarMessage(e+"\nUnable to Save!\n\n"),s.append("*************************************\n*************************************\nUnable to Save!*************************************\n*************************************\n"),s.append("\nError 171: Please open folder(workspace).\n")})}),o.commands.registerCommand("irite.deploy",()=>{l().then(e=>{c(e.toString()).then(e=>{let n=o.workspace.getConfiguration("irite").get("build.enginePath",""),t=o.workspace.getConfiguration("irite").get("build.compilerPath",""),i=o.window.activeTextEditor;s.append("*************************************\n*************************************\niRite Deploying: "+i.document.fileName+"\n");let a=i.document.fileName;var l=n;r.execFile(l,[a,t,"deploy"],(function(e,n,t){null!=t&&(console.log(e),console.log(t)),s.append(n)}))}).catch(e=>{o.window.showErrorMessage(e),s.appendLine(e)})}).catch(e=>{o.window.setStatusBarMessage("checkEngineDefined: "+e,5e3),s.appendLine("checkEngineDefined: "+e)})})}},function(e,n){e.exports=require("vscode")},function(e,n){e.exports=require("fs")},function(e,n,t){"use strict";var o=t(0),i=t(5);e.exports=function(e,n,t){var r,a=process.platform;switch("linux"===a&&-1!==i.release().indexOf("Microsoft")&&(a="win32"),a){case"win32":r="cmd.exe";break;case"darwin":r="open";break;default:r="xdg-open"}return"string"==typeof e&&(e=[e]),"function"==typeof n&&(t=n,n={}),n&&"object"==typeof n&&n.command&&("win32"===a?e=[n.command].concat(e):r=n.command),"win32"===a&&(e=e.map((function(e){return e.replace(/&/g,"^&")})),e=["/c","start",'""'].concat(e)),o.execFile(r,e,n,t)}},function(e,n){e.exports=require("os")}]);
//# sourceMappingURL=extension.js.map