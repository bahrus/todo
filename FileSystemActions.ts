///<reference path='StringUtils.ts'/>
///<reference path='todo.ts'/>
///<reference path='NodeJSImplementations.ts'/>
///<reference path='Scripts/typings/jquery/jquery.d.ts'/>
///<reference path='Scripts/typings/cheerio/cheerio.d.ts'/>
///<reference path='DOMActions.ts'/>

if(typeof(global) !== 'undefined'){
    require('./todo');
    require('./StringUtils');
    require('./NodeJSImplementations');
    
}



module todo.FileSystemActions {
   
    //tsp.ParserActions = global.tsp.ParserActions;
    
    //const ca = todo.CommonActions;
    const njsi = todo.NodeJSImplementations || global.todo.NodeJSImplementations;
    const su = todo.StringUtils || global.todo.StringUtils;
    //if (typeof (global) !== 'undefined') {
    //    if (!ca) ca = global.tsp.CommonActions;
    //    if (!pa) pa = global.tsp.ParserActions;
    //}
    //#region File Management
    export interface IFileManager {
        resolve(...pathSegments: any[]): string;
        getSeparator(): string;
        readTextFileSync(filePath: string): string;
        readTextFileAsync(filePath: string, callback: (err: Error, data: string) => void);
        listDirectorySync(dirPath: string): string[];
        getExecutingScriptFilePath: () => string;
        getWorkingDirectoryPath: () => string;
        writeTextFileSync(filePath: string, content: string): void;
        doesFilePathExist: (filePath: string) => boolean;
    }
    export interface IWebFileManager extends IFileManager {

        loadHTML: (html: string) => JQueryStatic
        minify: (filePath: string, callback: (err: Error, min: string) => void) => void;
    }

    export interface IWebContext extends IContext {
        //HTMLOutputs?: { [key: string]: JQueryStatic };
        //JSOutputs?: { [key: string]: string[] };
        fileManager: IWebFileManager;
    }
    // export interface IWebAction extends IAction {
    //     do: (context?: IWebContext, callback?: ICallback, action?: IWebAction) => void;

    // }

    export interface IExportDocumentsToFiles extends IAction {
        outputRootDirectoryPath?: string;

    }
    //#endregion

    //#region helper functions
    export module commonHelperFunctions {
        export function testForHtmlFileName(s: string) {
            return su.endsWith(s, '.html');
        }

        export function testForNonMinifiedJSFileName(s: string) {
            return su.endsWith(s, '.js') && !su.endsWith(s, '.min.js');
        }

        export function testForTsFileName(s: string) {
            return su.endsWith(s, '.ts');
        }

        export function assignFileManager(context: IContext) {
            const webContext = <IWebContext> context;
            if(!webContext.fileManager)  webContext.fileManager = new njsi.NodeJSWebFileManager();
            return webContext;
        }
    }
//#endregion

    //#region File Reader
    interface IFileReaderActionState extends IActionState {
        content?: string;
    }

    export interface ITextFileReaderAction extends IAction {
        relativeFilePath: string;
        domState?: IFileReaderActionState;
    }

    export function textFileReaderActionImpl(context?: IContext, callback?: ICallback, action?: ITextFileReaderAction) {
        if(!action) action = this;
        const webContext = commonHelperFunctions.assignFileManager(context);
        const rootdirectory = webContext.fileManager.getWorkingDirectoryPath();
        const wfm = webContext.fileManager;
        const filePath = wfm.resolve(rootdirectory, action.relativeFilePath);
        action.domState = {
            content: wfm.readTextFileSync(filePath),
        };
    }
    
    
    //#endregion
    
    

    //#region Wait for User Input
    export interface IWaitForUserInput extends IAction {
    }

    export function waitForUserInputImpl(context: IWebContext, callback: ICallback, action: IWaitForUserInput) {
        if (action.debug) debugger;
        if (context.processManager) {
            const test = (chunk: string, key: any) => {
                return key && key.ctrl && key.name == 'c';
            }
            context.processManager.WaitForUserInputAndExit('Press ctrl c to exit', test);
        }
        todo.endAction(action, callback);
    }
//#endregion

//#region File Selection
    

    export class FilePathGenerator implements todo.IAction {
        public hasNext: boolean;
        constructor(
            public rootDirectoryPath?: string, 
            public selectedFilePaths?: string[], 
            public currentIndex?: number, 
            public currentFilePath?: string){
                this.callbacks = [];
                this.hasNext = this.currentIndex < this.selectedFilePaths.length - 1;
            }
            
        
        
        do(){
            this.currentIndex++;
            this.currentFilePath = this.selectedFilePaths[this.currentIndex];
            this.hasNext = this.currentIndex < this.selectedFilePaths.length - 1;
            this.callbacks.forEach(callback => callback(null));
        }
        
        callbacks: ICallback[];
    }

    export interface IFileSelectorAction extends IAction {
        //fileName?: string;
        fileTest?: (s: string) => boolean;
        relativeFilePath?: string;
        recursive?: boolean;
        filePathGenerator?: FilePathGenerator;
    }
    
    

    export function FileSelectorActionImpl(context: IWebContext, callback: ICallback, action: IFileSelectorAction ) {
        if(!action) action = this;
        if (action.debug) debugger;
        
        const webContext = commonHelperFunctions.assignFileManager(context);
        const rootDirectoryPath = webContext.fileManager.getWorkingDirectoryPath();
        let files = context.fileManager.listDirectorySync(rootDirectoryPath);
        if (action.fileTest) files = files.filter(action.fileTest);
        files = files.map(s => rootDirectoryPath + s);
        if (!action.filePathGenerator) action.filePathGenerator = new FilePathGenerator (
            rootDirectoryPath,
            files,
            files.length > 0 ? 0 : -1,
            files.length > 0 ? files[0] : null
        );
    }
//#endregion

//#region Html File Selection
    export interface IHTMLFileSelectorAction extends IFileSelectorAction {
        htmlFileSelectorState?: DOMActions.IHTMLFile;
    }
    
    
    function loadCurrentFile(context: IWebContext, callback: ICallback, action: IHTMLFileSelectorAction ) {
        const wfm = context.fileManager;
        const content = wfm.readTextFileSync(action.filePathGenerator.currentFilePath);
        const $ = context.fileManager.loadHTML(content);
        action.htmlFileSelectorState = {
            filePath: action.filePathGenerator.currentFilePath,
            $: $,
            originalContent: content,
        };
    
    }
    export function HTMLFileSelectorActionImpl(context: IWebContext, callback: ICallback, action: IHTMLFileSelectorAction ) {
        FileSelectorActionImpl(context, callback, action);
        action.filePathGenerator.callbacks.push((err) => loadCurrentFile(context, callback, action));
        loadCurrentFile(context, callback, action);
    }
//#endregion

//#region
    export interface IHTMLFileSaveAction extends IAction{
        htmlFileSelectorState?: DOMActions.IHTMLFile;
        filePathModifier?:  ITypedAction<string, string>;
    }
    
    export function HTMLFileSaveActionImpl(context: IWebContext, callback: ICallback, action: IHTMLFileSaveAction){
        if(!action) action = this;
        const $any = <any> action.htmlFileSelectorState.$;
        const $cheerio = <CheerioStatic> $any;
        const sOutput = $cheerio.html();
        action.filePathModifier.arguments = action.htmlFileSelectorState.filePath;
        action.filePathModifier.do(action.filePathModifier.arguments);
        const saveFilePath = action.filePathModifier.returnObj;
        context.fileManager.writeTextFileSync(saveFilePath, sOutput);
    }
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
    // export function exportProcessedDocumentsToFiles(action: IExportDocumentsToFiles, context: IWebContext, callback: ICallback) {
    //     if (action.debug) debugger;
    //     for (const filePath in context.HTMLOutputs) {
    //         const $ = <CheerioStatic><any> context.HTMLOutputs[filePath];
    //         context.fileManager.writeTextFileSync((<string>filePath).replace('.html', '.temp.html'), $.html());
    //     }
    //     todo.endAction(action, callback);
    // }
    //#endregion
}

(function(__global: any) {
    const modInfo = {
        name: 'todo',
        mod: todo,
        //subMod: todo.CommonActions,
    }
    if (typeof __global[modInfo.name] !== "undefined") {
        if (__global[modInfo.name] !== modInfo.mod) {
            for (var p in modInfo.mod) {
                __global[modInfo.name][p] = (<any>modInfo.mod)[p];
            }
        }
    }
    else {
        __global[modInfo.name] = modInfo.mod;
    }
})(
    typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());


