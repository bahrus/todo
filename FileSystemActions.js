///<reference path='StringUtils.ts'/>
///<reference path='todo.ts'/>
///<reference path='NodeJSImplementations.ts'/>
///<reference path='Scripts/typings/jquery/jquery.d.ts'/>
///<reference path='Scripts/typings/cheerio/cheerio.d.ts'/>
if (typeof (global) !== 'undefined') {
    require('./todo');
    require('./StringUtils');
    require('./NodeJSImplementations');
}
var todo;
(function (todo) {
    var FileSystemActions;
    (function (FileSystemActions) {
        //tsp.ParserActions = global.tsp.ParserActions;
        //const ca = todo.CommonActions;
        var njsi = todo.NodeJSImplementations || global.todo.NodeJSImplementations;
        var su = todo.StringUtils || global.todo.StringUtils;
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
            function assignFileManager(context) {
                var webContext = context;
                if (!webContext.fileManager)
                    webContext.fileManager = new njsi.NodeJSWebFileManager();
                return webContext;
            }
            commonHelperFunctions.assignFileManager = assignFileManager;
        })(commonHelperFunctions = FileSystemActions.commonHelperFunctions || (FileSystemActions.commonHelperFunctions = {}));
        function textFileReaderActionImpl(context, callback, action) {
            if (!action)
                action = this;
            var webContext = commonHelperFunctions.assignFileManager(context);
            var rootdirectory = webContext.fileManager.getWorkingDirectoryPath();
            var wfm = webContext.fileManager;
            var filePath = wfm.resolve(rootdirectory, action.relativeFilePath);
            action.state = {
                content: wfm.readTextFileSync(filePath),
            };
        }
        FileSystemActions.textFileReaderActionImpl = textFileReaderActionImpl;
        function waitForUserInputImpl(context, callback, action) {
            if (action.debug)
                debugger;
            if (context.processManager) {
                var test = function (chunk, key) {
                    return key && key.ctrl && key.name == 'c';
                };
                context.processManager.WaitForUserInputAndExit('Press ctrl c to exit', test);
            }
            todo.endAction(action, callback);
        }
        FileSystemActions.waitForUserInputImpl = waitForUserInputImpl;
        //#endregion
        //#region File Selection
        // export interface IRootDirectoryRetriever {
        //     rootDirectoryRetriever?: (context: IWebContext) => string;
        // }
        var FileSelectorActionState = (function () {
            function FileSelectorActionState(rootDirectoryPath, selectedFilePaths, currentIndex, currentFilePath) {
                this.rootDirectoryPath = rootDirectoryPath;
                this.selectedFilePaths = selectedFilePaths;
                this.currentIndex = currentIndex;
                this.currentFilePath = currentFilePath;
            }
            Object.defineProperty(FileSelectorActionState.prototype, "hasNext", {
                get: function () {
                    return this.currentIndex < this.selectedFilePaths.length - 1;
                },
                enumerable: true,
                configurable: true
            });
            FileSelectorActionState.prototype.do = function () {
                this.currentIndex++;
                this.currentFilePath = this.selectedFilePaths[this.currentIndex];
            };
            return FileSelectorActionState;
        })();
        FileSystemActions.FileSelectorActionState = FileSelectorActionState;
        function FileSelectorActionImpl(context, callback, action) {
            if (!action)
                action = this;
            if (action.debug)
                debugger;
            var webContext = commonHelperFunctions.assignFileManager(context);
            var rootDirectoryPath = webContext.fileManager.getWorkingDirectoryPath();
            var files = context.fileManager.listDirectorySync(rootDirectoryPath);
            if (action.fileTest)
                files = files.filter(action.fileTest);
            files = files.map(function (s) { return rootDirectoryPath + s; });
            if (!action.state)
                action.state = new FileSelectorActionState(rootDirectoryPath, files, files.length > 0 ? 0 : -1, files.length > 0 ? files[0] : null);
        }
        FileSystemActions.FileSelectorActionImpl = FileSelectorActionImpl;
        //#endregion
        //#region File Processing
        // export interface IFileProcessorActionState extends IActionState {
        //     filePath: string;
        // }
        // export interface IHTMLFileProcessorActionState extends IFileProcessorActionState, IActionState {
        //     //$?: JQueryStatic
        //     HTMLFiles?: IHTMLFile[];
        // }
        // export interface IFileProcessorAction extends IAction {
        //     state?: IFileProcessorActionState;
        //     fileSubProcessActions?: IAction[];
        // }
        // //#region HTML File Processing
        // export interface IHTMLFileProcessorAction extends IFileProcessorAction {
        //     state?: IHTMLFileProcessorActionState;
        // }
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
        // export function minifyJSFile(action: IFileProcessorAction, context: IWebContext, callback: ICallback) {
        //     console.log('Uglifying ' + action.state.filePath);
        //     const filePath = action.state.filePath;
        //     context.fileManager.minify(filePath,(err, min) => {
        //         if (err) {
        //             console.log('Error uglifying ' + filePath);
        //         } else {
        //             console.log('Uglified ' + filePath);
        //         }
        //         if (!callback) {
        //             throw "Unable to minify JS files synchronously";
        //         }
        //         todo.endAction(action, callback);
        //     });
        // }
        //#endregion
        //#endregion
        //#region File Select and Process
        // export interface ISelectAndProcessFileAction extends IWebAction {
        //     fileSelector?: IFileSelectorAction
        //     fileProcessor?: IFileProcessorAction;
        // }
        // export function selectAndProcessFiles(action: ISelectAndProcessFileAction, context: IWebContext, callback: ICallback) {
        //     if (action.debug) debugger;
        //     const fs = action.fileSelector;
        //     fs.do(context, null, fs);
        //     const selectedFilePaths = fs.state.selectedFilePaths;
        //     const len = selectedFilePaths.length;
        //     if (len === 0) {
        //         todo.endAction(action, callback);
        //         return;
        //     }
        //     const fp = action.fileProcessor;
        //     if (action.async) {
        //         let idx = 0;
        //         const fpCallback = (err) => {
        //             if (idx < len) {
        //                 const filePath = selectedFilePaths[idx];
        //                 idx++;
        //                 if (!fp.state) {
        //                     fp.state = {
        //                         filePath: filePath,
        //                     }
        //                 } else {
        //                     fp.state.filePath = filePath;
        //                 }
        //                 fp.do(context, fpCallback, fp);
        //             } else {
        //                 todo.endAction(action, callback);
        //             }
        //         }
        //         fpCallback(null);
        //     } else {
        //         const n = fs.state.selectedFilePaths.length;
        //         for (let i = 0; i < n; i++) {
        //             const filePath = fs.state.selectedFilePaths[i];
        //             if (!fp.state) {
        //                 fp.state = {
        //                     filePath: filePath,
        //                 };
        //             } else {
        //                 fp.state.filePath = filePath;
        //             }
        //             fp.do(context, null, fp);
        //         }
        //        todo.endAction(action, callback);
        //     }
        // }
        // export interface IHTMLFile {
        //     filePath?: string;
        //     $: JQueryStatic;
        // }
        // interface ISelectAndReadHTLMFilesActionState {
        //     htmlFiles?: IHTMLFile[];
        // }
        // export interface ISelectAndReadHTMLFilesAction extends IWebAction {
        //     fileSelector: IFileSelectorAction;
        //     fileProcessor?: IHTMLFileProcessorAction;
        //     state?: ISelectAndReadHTLMFilesActionState;
        // }
        // export function storeHTMLFiles(action: IHTMLFileProcessorAction, context: IWebContext, callback: ICallback) {
        //     if (action.debug) debugger;
        //     const fm = context.fileManager;
        //     const filePath = action.state.filePath;
        //     const contents = fm.readTextFileSync(filePath);
        //     //action.state.$ = fm.loadHTML(contents);
        //     if (!action.state.HTMLFiles) action.state.HTMLFiles = [];
        //     const $ = fm.loadHTML(contents);
        //     action.state.HTMLFiles.push({
        //         $: $,
        //         filePath: filePath,
        //     });
        //     context.HTMLOutputs[filePath] = $;
        //     todo.endAction(action, callback);
        // }
        //#endregion
        //#region Exporting Processed Documents to Files
        function exportProcessedDocumentsToFiles(action, context, callback) {
            if (action.debug)
                debugger;
            for (var filePath in context.HTMLOutputs) {
                var $_1 = context.HTMLOutputs[filePath];
                context.fileManager.writeTextFileSync(filePath.replace('.html', '.temp.html'), $_1.html());
            }
            todo.endAction(action, callback);
        }
        FileSystemActions.exportProcessedDocumentsToFiles = exportProcessedDocumentsToFiles;
    })(FileSystemActions = todo.FileSystemActions || (todo.FileSystemActions = {}));
})(todo || (todo = {}));
(function (__global) {
    var modInfo = {
        name: 'todo',
        mod: todo,
    };
    if (typeof __global[modInfo.name] !== "undefined") {
        if (__global[modInfo.name] !== modInfo.mod) {
            for (var p in modInfo.mod) {
                __global[modInfo.name][p] = modInfo.mod[p];
            }
        }
    }
    else {
        __global[modInfo.name] = modInfo.mod;
    }
})(typeof window !== "undefined" ? window :
    typeof WorkerGlobalScope !== "undefined" ? self :
        typeof global !== "undefined" ? global :
            Function("return this;")());
//# sourceMappingURL=FileSystemActions.js.map