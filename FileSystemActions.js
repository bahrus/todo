///<reference path='StringUtils.ts'/>
///<reference path='todo.ts'/>
///<reference path='NodeJSImplementations.ts'/>
///<reference path='Scripts/typings/jquery/jquery.d.ts'/>
///<reference path='Scripts/typings/cheerio/cheerio.d.ts'/>
///<reference path='DOMActions.ts'/>
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
            action.domState = {
                content: wfm.readTextFileSync(filePath)
            };
        }
        FileSystemActions.textFileReaderActionImpl = textFileReaderActionImpl;
        function waitForUserInputImpl(context, callback, action) {
            if (action.debug)
                debugger;
            if (context.processManager) {
                var test_1 = function (chunk, key) {
                    return key && key.ctrl && key.name == 'c';
                };
                context.processManager.WaitForUserInputAndExit('Press ctrl c to exit', test_1);
            }
            todo.endAction(action, callback);
        }
        FileSystemActions.waitForUserInputImpl = waitForUserInputImpl;
        //#endregion
        //#region File Selection
        var FilePathGenerator = (function () {
            function FilePathGenerator(rootDirectoryPath, selectedFilePaths, currentIndex, currentFilePath) {
                this.rootDirectoryPath = rootDirectoryPath;
                this.selectedFilePaths = selectedFilePaths;
                this.currentIndex = currentIndex;
                this.currentFilePath = currentFilePath;
                this.callbacks = [];
                this.hasNext = this.currentIndex < this.selectedFilePaths.length - 1;
            }
            FilePathGenerator.prototype.do = function () {
                this.currentIndex++;
                this.currentFilePath = this.selectedFilePaths[this.currentIndex];
                this.hasNext = this.currentIndex < this.selectedFilePaths.length - 1;
                this.callbacks.forEach(function (callback) { return callback(null); });
            };
            return FilePathGenerator;
        })();
        FileSystemActions.FilePathGenerator = FilePathGenerator;
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
            if (!action.filePathGenerator)
                action.filePathGenerator = new FilePathGenerator(rootDirectoryPath, files, files.length > 0 ? 0 : -1, files.length > 0 ? files[0] : null);
        }
        FileSystemActions.FileSelectorActionImpl = FileSelectorActionImpl;
        function loadCurrentFile(context, callback, action) {
            var wfm = context.fileManager;
            var content = wfm.readTextFileSync(action.filePathGenerator.currentFilePath);
            var $ = context.fileManager.loadHTML(content);
            action.htmlFileSelectorState = {
                filePath: action.filePathGenerator.currentFilePath,
                $: $,
                originalContent: content
            };
        }
        function HTMLFileSelectorActionImpl(context, callback, action) {
            FileSelectorActionImpl(context, callback, action);
            action.filePathGenerator.callbacks.push(function (err) { return loadCurrentFile(context, callback, action); });
            loadCurrentFile(context, callback, action);
        }
        FileSystemActions.HTMLFileSelectorActionImpl = HTMLFileSelectorActionImpl;
        function HTMLFileSaveActionImpl(context, callback, action) {
            if (!action)
                action = this;
            var $any = action.htmlFileSelectorState.$;
            var $cheerio = $any;
            var sOutput = $cheerio.html();
            action.filePathModifier.arguments = action.htmlFileSelectorState.filePath;
            action.filePathModifier.do(action.filePathModifier.arguments);
            var saveFilePath = action.filePathModifier.returnObj;
            context.fileManager.writeTextFileSync(saveFilePath, sOutput);
        }
        FileSystemActions.HTMLFileSaveActionImpl = HTMLFileSaveActionImpl;
    })(FileSystemActions = todo.FileSystemActions || (todo.FileSystemActions = {}));
})(todo || (todo = {}));
(function (__global) {
    var modInfo = {
        name: 'todo',
        mod: todo
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