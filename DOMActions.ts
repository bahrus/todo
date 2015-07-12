///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>

module todo.DOMActions {
    
    const su = todo.StringUtils || global.todo.StringUtils;
    const fsa = todo.FileSystemActions || global.todo.FileSystemActions;

    //#region DOM Actions
    export interface IUglify {
        uglify(pathOfReferencingFile: string, relativeURL: string): string;
    }
    
    export interface IHTMLFile {
        filePath?: string;
        originalContent?: string;
        $: JQueryStatic;
    }

    interface IDOMState   {
        htmlFile?: IHTMLFile;
    }

    

    //#endregion
    //#region Element Build Actions

    interface IDOMElementBuildActionState extends IDOMState {
        //htmlFile: IHTMLFile;
        elements?: JQuery;
        //DOMTransform?: IDOMTransformAction;
    }

    export interface IDOMElementBuildAction extends IAction {
        domState?: IDOMElementBuildActionState;
    }
    
    export interface IRemoveDOMElementAction extends IDOMElementBuildAction{
        selector: IDOMElementCSSSelector;
    }
    
    export function RemoveDOMElementActionImpl(context: FileSystemActions.IWebContext, callback: todo.ICallback, action: IRemoveDOMElementAction) {
        if(!action) action = this;
        if(!action.selector.do) action.selector.do =  DOMElementCSSSelectorImpl;
        action.selector.domState = action.domState;
        action.selector.do(context, null, action.selector);
        action.domState.elements.remove();
        endAction(action, callback);
    }

    export function addToJSClob(context: IContext, callback: ICallback, action?: IDOMElementBuildAction) {
        const state = action.domState;
        const src = action.domState.elements.attr('src');
        fsa.commonHelperFunctions.assignFileManager(context);
        const webContext = <FileSystemActions.IWebContext> context;
        const referringDir = webContext.fileManager.resolve(state.htmlFile.filePath, '..', src);
        if (!webContext.JSOutputs) webContext.JSOutputs = {};
        const jsOutputs = webContext.JSOutputs;
        if (!jsOutputs[referringDir]) jsOutputs[state.htmlFile.filePath] = [];
        const minifiedVersionFilePath = su.replaceEndWith(referringDir, '.js', '.min.js');
        if (!webContext.fileManager.doesFilePathExist(minifiedVersionFilePath)) {
            console.log('minified filepath ' + minifiedVersionFilePath + ' does not exist.');
            endAction(action, callback);
            return;
        }
        const minifiedContent = webContext.fileManager.readTextFileSync(minifiedVersionFilePath);
        jsOutputs[state.htmlFile.filePath].push(minifiedContent);
        action.domState.elements.remove();
        endAction(action, callback);
    }

    //#endregion

    //#region DOM Element Css Selector
    export interface IDOMElementCSSSelectorState extends IDOMState  {
        relativeTo?: JQuery;
        elements?: JQuery;
        treeNode?: IDOMTransformAction;
    }

    export interface IDOMElementSelector extends IAction {
    }

    export interface IDOMElementCSSSelector extends IDOMElementSelector {
        cssSelector: string;
        domState?: IDOMElementCSSSelectorState;
    }

    export function DOMElementCSSSelectorImpl(context: FileSystemActions.IWebContext, callback?: ICallback, action?: IDOMElementCSSSelector) {
        if (action.debug) debugger;
        const aS = action.domState;
        if (aS.relativeTo) {
            aS.elements = aS.relativeTo.find(action.cssSelector);
        } else {
            //aS.elements = aS.$(action.cssSelector);
            aS.elements = aS.htmlFile.$(action.cssSelector);
        }
        endAction(action, callback);
    }
    //#endregion

    //#region DOM Transform

    export interface IDOMTransformActionState extends IDOMState {
        parent?: IDOMTransformAction;
    }

    export interface IDOMTransformAction extends IAction {
        selector: IDOMElementCSSSelector;
        elementAction?: IDOMElementBuildAction;
        domState?: IDOMTransformActionState;
    }

    export function DOMTransform(context: IContext, callback: ICallback, action: IDOMTransformAction) {
        let elements: JQuery;
        let p: IDOMTransformAction;
        if (action.domState) {
            p = action.domState.parent;
        }
        const aSel = action.selector;
        if (!aSel.domState) {
            aSel.domState = {
                htmlFile: action.domState.htmlFile,
            };
        }
        const aSelSt = aSel.domState;
        aSelSt.treeNode = action;
        if (p && p.elementAction) {
            aSelSt.relativeTo = p.elementAction.domState.elements;
        }
        aSel.do(context, null, aSel);
        const eA = action.elementAction;
        if (eA) {
            //#region element Action
            eA.domState = {
                elements: null,
                DOMTransform: action,
                htmlFile: aSelSt.htmlFile,
            };
            if (eA.async) {
                let i = 0;
                const n = aSelSt.elements.length;
                const eACallback = (err) => {
                    if (i < n) {
                        const $elem = aSelSt.htmlFile.$(aSelSt.elements[i]);
                        i++;
                        eA.domState.elements = $elem;
                        eA.do(context, eACallback, eA);
                    } else {
                        endAction(action, callback);
                    }
                };
                eACallback(null);
            } else {
                const n = aSelSt.elements.length
                for (let i = 0; i < n; i++) {
                    const $elem = aSelSt.htmlFile.$(aSelSt.elements[i]);
                    eA.domState.elements = $elem;
                    eA.do(context, null, eA);
                }
                endAction(action, callback);
            }
            //#endregion
        } else {
            endAction(action, callback);
        }


    }

    //type ISubMergeHTMLFileIntoDomTransform = CommonActions.ISubMergeAction<IDOMTransformAction, FileSystemActions.IHTMLFile, IDOMTransformActionState>;

    //export interface IPutHTMLFileIntoDomTransformAction extends CommonActions.IAction {
    //    htmlFiles: FileSystemActions.IHTMLFile[];
    //    domTransforms: IDOMTransformAction[];
    //}

    // export interface IDOMTransformForEachHTMLFileAction<TContainer, TListItem> {
    //     //htmlFilesGenerator?: (container: TContainer) => FileSystemActions.IHTMLFile[];
    //     //domTransformsGenerator?: (container: TContainer) => IDOMTransformAction[];
    //     //putHTMLFileIntoDomTransformGenerator?: (container: TContainer) => IPutHTMLFileIntoDomTransformAction;
    //     htmlFiles?: FileSystemActions.IHTMLFile[];
    //     domTransforms?: IDOMTransformAction[];
    // }

    // export function ApplyDOMTransformsOnHTMLFiles<TContainer, TListItem>(action: IDOMTransformForEachHTMLFileAction<TContainer, TListItem>, context: FileSystemActions.IWebContext, callback: CommonActions.ICallback) {
    //     const htmlFiles = action.htmlFiles;
    //     const domTransforms = action.domTransforms;
    //     for (let i = 0, n = htmlFiles.length; i < n; i++) {
    //         const htmlFile = htmlFiles[i];
    //         for (let j = 0, m = domTransforms.length; j < m; j++) {
    //             const domTransform = domTransforms[j];
    //             domTransform.state = {
    //                 htmlFile: htmlFile,
    //             };
               
    //             domTransform.do(domTransform, context, null);
    //         }
    //     }
    // }
//#endregion
}

