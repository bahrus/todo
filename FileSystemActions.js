///<reference path='StringUtils.ts'/>
///<reference path='CommonActions.ts'/>
///<reference path='Scripts/typings/jquery/jquery.d.ts'/>
///<reference path='Scripts/typings/cheerio/cheerio.d.ts'/>
var todo;
(function (todo) {
    var FileSystemActions;
    (function (FileSystemActions) {
        //tsp.ParserActions = global.tsp.ParserActions;
        var su = todo.StringUtils;
        var ca = todo.CommonActions;
        //#endregion
        //#region helper functions
        var commonHelperFunctions;
        (function (commonHelperFunctions) {
            function testForHtmlFileName(s) {
                return su.endsWith(s, '.html');
            }
            commonHelperFunctions.testForHtmlFileName = testForHtmlFileName;
            function testForNonMinifiedJSFileName(s) {
                return su.endsWith(s, '.js') && !su.endsWith(s, '.min.js');
            }
            commonHelperFunctions.testForNonMinifiedJSFileName = testForNonMinifiedJSFileName;
            function testForTsFileName(s) {
                return su.endsWith(s, '.ts');
            }
            commonHelperFunctions.testForTsFileName = testForTsFileName;
            function retrieveWorkingDirectory(context) {
                var wfm = context.fileManager;
                return wfm.getWorkingDirectoryPath() + wfm.getSeparator();
            }
            commonHelperFunctions.retrieveWorkingDirectory = retrieveWorkingDirectory;
        })(commonHelperFunctions = FileSystemActions.commonHelperFunctions || (FileSystemActions.commonHelperFunctions = {}));
        function readTextFile(action, context) {
            var rootdirectory = action.rootDirectoryRetriever(context);
            var wfm = context.fileManager;
            var filePath = wfm.resolve(rootdirectory, action.relativeFilePath);
            action.state = {
                content: wfm.readTextFileSync(filePath),
            };
        }
        FileSystemActions.readTextFile = readTextFile;
        function cacheTextFile(action, context, callback) {
            action.fileReaderAction.do(context, null, action.fileReaderAction);
            context.stringCache[action.cacheKey] = action.fileReaderAction.state.content;
            ca.endAction(action, callback);
        }
        FileSystemActions.cacheTextFile = cacheTextFile;
        function waitForUserInput(action, context, callback) {
            if (action.debug)
                debugger;
            if (context.processManager) {
                var test = function (chunk, key) {
                    return key && key.ctrl && key.name == 'c';
                };
                context.processManager.WaitForUserInputAndExit('Press ctrl c to exit', test);
            }
            ca.endAction(action, callback);
        }
        FileSystemActions.waitForUserInput = waitForUserInput;
        function selectFiles(action, context) {
            if (action.debug)
                debugger;
            if (!action.state) {
                action.state = {
                    rootDirectory: action.rootDirectoryRetriever(context),
                };
            }
            var files = context.fileManager.listDirectorySync(action.state.rootDirectory);
            if (action.fileTest)
                files = files.filter(action.fileTest);
            files = files.map(function (s) { return action.state.rootDirectory + s; });
            action.state.selectedFilePaths = files;
        }
        FileSystemActions.selectFiles = selectFiles;
        //function processHTMLFileSubRules(action: IHTMLFileProcessorAction, context: IWebContext, data: string) {
        //    if (action.debug) debugger;
        //    const $ = context.fileManager.loadHTML(data);
        //    action.state.$ = $;
        //    if (action.fileSubProcessActions) {
        //        const n = action.fileSubProcessActions.length;
        //        for (const i = 0; i < n; i++) {
        //            const fspa = <IHTMLFileProcessorAction> action.fileSubProcessActions[i];
        //            fspa.state = {
        //                $: action.state.$,
        //                filePath: action.state.filePath,
        //            };
        //            fspa.do(fspa, context);
        //        }
        //    }
        //    if (!context.HTMLOutputs) context.HTMLOutputs = {};
        //    context.HTMLOutputs[action.state.filePath] = action.state.$;
        //    if (action.debug) {
        //        const $any = <any> action.state.$;
        //        const $cheerio = <CheerioStatic> $any;
        //        const sOutput = $cheerio.html();
        //        debugger;
        //    }
        //}
        //export function processHTMLFile(action: IHTMLFileProcessorAction, context: IWebContext, callback: CommonActions.ICallback) {
        //    const wfm = context.fileManager;
        //    console.log('processing ' + action.state.filePath);
        //    if (callback) {
        //        wfm.readTextFileAsync(action.state.filePath,(err, data) => {
        //            processHTMLFileSubRules(action, context, data);
        //            callback(err);
        //        });
        //    } else {
        //        const data = wfm.readTextFileSync(action.state.filePath);
        //        processHTMLFileSubRules(action, context, data);
        //        ca.endAction(action, callback);
        //    }
        //}
        //#endregion
        //#region JS File Processing
        function minifyJSFile(action, context, callback) {
            console.log('Uglifying ' + action.state.filePath);
            var filePath = action.state.filePath;
            context.fileManager.minify(filePath, function (err, min) {
                if (err) {
                    console.log('Error uglifying ' + filePath);
                }
                else {
                    console.log('Uglified ' + filePath);
                }
                if (!callback) {
                    throw "Unable to minify JS files synchronously";
                }
                ca.endAction(action, callback);
            });
        }
        FileSystemActions.minifyJSFile = minifyJSFile;
        function selectAndProcessFiles(action, context, callback) {
            if (action.debug)
                debugger;
            var fs = action.fileSelector;
            fs.do(context, null, fs);
            var selectedFilePaths = fs.state.selectedFilePaths;
            var len = selectedFilePaths.length;
            if (len === 0) {
                ca.endAction(action, callback);
                return;
            }
            var fp = action.fileProcessor;
            if (action.async) {
                var idx = 0;
                var fpCallback = function (err) {
                    if (idx < len) {
                        var filePath = selectedFilePaths[idx];
                        idx++;
                        if (!fp.state) {
                            fp.state = {
                                filePath: filePath,
                            };
                        }
                        else {
                            fp.state.filePath = filePath;
                        }
                        fp.do(context, fpCallback, fp);
                    }
                    else {
                        ca.endAction(action, callback);
                    }
                };
                fpCallback(null);
            }
            else {
                var n = fs.state.selectedFilePaths.length;
                for (var i = 0; i < n; i++) {
                    var filePath = fs.state.selectedFilePaths[i];
                    if (!fp.state) {
                        fp.state = {
                            filePath: filePath,
                        };
                    }
                    else {
                        fp.state.filePath = filePath;
                    }
                    fp.do(context, null, fp);
                }
                ca.endAction(action, callback);
            }
        }
        FileSystemActions.selectAndProcessFiles = selectAndProcessFiles;
        function storeHTMLFiles(action, context, callback) {
            if (action.debug)
                debugger;
            var fm = context.fileManager;
            var filePath = action.state.filePath;
            var contents = fm.readTextFileSync(filePath);
            //action.state.$ = fm.loadHTML(contents);
            if (!action.state.HTMLFiles)
                action.state.HTMLFiles = [];
            var $ = fm.loadHTML(contents);
            action.state.HTMLFiles.push({
                $: $,
                filePath: filePath,
            });
            context.HTMLOutputs[filePath] = $;
            ca.endAction(action, callback);
        }
        FileSystemActions.storeHTMLFiles = storeHTMLFiles;
        //#endregion
        //#region Exporting Processed Documents to Files
        function exportProcessedDocumentsToFiles(action, context, callback) {
            if (action.debug)
                debugger;
            for (var filePath in context.HTMLOutputs) {
                var $_1 = context.HTMLOutputs[filePath];
                context.fileManager.writeTextFileSync(filePath.replace('.html', '.temp.html'), $_1.html());
            }
            ca.endAction(action, callback);
        }
        FileSystemActions.exportProcessedDocumentsToFiles = exportProcessedDocumentsToFiles;
    })(FileSystemActions = todo.FileSystemActions || (todo.FileSystemActions = {}));
})(todo || (todo = {}));
//# sourceMappingURL=FileSystemActions.js.map