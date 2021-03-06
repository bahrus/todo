﻿///<reference path='Scripts/typings/node/node.d.ts'/>

if (!Object['assign']) {
	//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}


module todo {
    

    export const versionKey = 'version';

    export interface IProcessManager {
        WaitForUserInputAndExit(message: string, testForExit: (chunk: string, key: any) => boolean);
    }


    export interface IContext {
        stringCache?: { [key: string]: string };
        processManager?: IProcessManager;
    }

    export interface IActionState {
    }

    export interface ICallback {
        (err): void;
    }

    export interface IAction {
        do?: (context?: IContext, callback?: ICallback, action?: IAction) => void;
        state?: IActionState;
        debug?: boolean;
        log?: boolean;
        async?: boolean;
    }

    export function endAction(action: IAction, callback: ICallback) {
        if (callback) callback(null);
    }

    //#region Message Action
    export interface IMessageState extends IActionState {
        dynamicMessage?: string;
    }

    export interface IObjectGenerator<TInput, TObject>{
        (action: TInput) : TObject;
    }
    
    export interface ITypedAction<TInput, TOutput>{
        arguments?: TInput;
        do?: IObjectGenerator<TInput, TOutput>;
        returnObj?: TOutput;
    }
    
    export interface IConsoleLogAction extends IAction {
        message?: stringOrStringGenerator;
        domState?: IMessageState;
    }
    
    type stringOrStringGenerator = string | IObjectGenerator<IConsoleLogAction, string>;

    export function ConsoleLogActionImpl(context?: IContext, callback?: ICallback, consoleAction?: IConsoleLogAction) {
        let cA = consoleAction;
        if(!cA) cA = <IConsoleLogAction> this;
        let message: string;
        const messageOrMessageGenerator = cA.message;
        if(typeof messageOrMessageGenerator === 'string'){
            message = messageOrMessageGenerator;
        }else if(typeof messageOrMessageGenerator === 'function'){
            message = messageOrMessageGenerator(cA);
            cA.domState = {
                dynamicMessage: message,
            };
        }else{
            console.log(messageOrMessageGenerator);
            throw 'Not Supported Message Type';
        }
        
        console.log(message);
    }

    //#endregion

    //#region Action Management
    
    // interface IActionGenerator{
    //     (action: IAction): IAction;
    // }
    
    type actionOrActionGenerator = IAction | IObjectGenerator<IAction, IAction>;
    
    
    export interface ICompositeActions extends IAction {
        actions?: actionOrActionGenerator[];
    }

    function doActionOrActionGenerator(context?: IContext, callback?:  ICallback, action?: ICompositeActions, subAction?: actionOrActionGenerator){
        let generatedAction : IAction;
        if(typeof subAction === 'object'){
            generatedAction = <IAction> subAction;
        }else if(typeof subAction === 'function'){
            const actionGenerator = <IObjectGenerator<IAction, IAction>> subAction;
            generatedAction = actionGenerator(action);
            if(typeof generatedAction === 'function'){
                doActionOrActionGenerator(context, callback, action, generatedAction);
                return;
            }
        }else{
            throw 'Action Type not supported.'
        }
        generatedAction.do(context, callback, generatedAction);
    }
    function doActions(context?: IContext, callback?: ICallback, action?: ICompositeActions,  actions?:  actionOrActionGenerator[]){
        actions.forEach(subAction => {
            doActionOrActionGenerator(context, callback, action, subAction)
        });
    }
    export function CompositeActionsImpl(context?: IContext, callback?: ICallback, action?: ICompositeActions){
        let thisAction = action;
        if(!thisAction) thisAction = this;
        if(!thisAction.actions) {
            console.warn('No actions found!');
            return;
        }
        doActions(context, callback, thisAction, thisAction.actions);
    }
    
    export interface IRecurringAction extends IAction {
        testForRepeat?: (action: IRecurringAction) => boolean;
        repeatingActions?: actionOrActionGenerator[];
        initActions?: actionOrActionGenerator[];
        finalActions?: actionOrActionGenerator[];
    }
    
    export function RecurringActionImpl(context?: IContext, callback?: ICallback, action?: IRecurringAction){
        let thisAction = action;
        if(!thisAction) thisAction = this;
        if(!thisAction.initActions && !thisAction.repeatingActions && !thisAction.finalActions){
            console.warn('No actions found!');
            return;
        }
        if(thisAction.initActions) doActions(context, callback, thisAction, thisAction.initActions);
        while(thisAction.testForRepeat(thisAction)){
            doActions(context, callback, thisAction, thisAction.repeatingActions);
        }
        if(thisAction.finalActions) doActions(context, callback, thisAction, thisAction.finalActions);
    }
    //#region
    
    //#region not tested recently

    export interface IMergeAction<T> extends IAction {
        srcRefs: T[];
        destRef: T;
    }

    export function merge<T>(mergeAction: IMergeAction<T>, context: IContext, callback: ICallback) {
        const n = mergeAction.srcRefs.length;
        for (let i = 0; i < n; i++) {
            const srcRef = mergeAction.srcRefs[i];
            //TODO:  implement merge
            Object['assign'](mergeAction.destRef, srcRef);
        }
    }
    //#endregion
    
    //#region deprecated
    
    // export interface ISubMergeAction<TDestAction extends IAction, TSrc, TProp> {
    //     srcRefs: TSrc[];
    //     destRefs: TDestAction[];
    //     destinationPropertyGetter?: (destAction: TDestAction) => TProp;
    //     sourcePropertyGetter?: (src: TSrc) => TProp;
    // }

    // export function subMerge<TDestAction extends IAction, TSrc, TProp>(subMergeAction: ISubMergeAction<TDestAction, TSrc, TProp>, context: IContext, callback: ICallback) {
    //     const dpg = subMergeAction.destinationPropertyGetter;
    //     const spg = subMergeAction.sourcePropertyGetter;
    //     const srcRefs = subMergeAction.srcRefs;
    //     if (!srcRefs) {
    //         endAction(subMergeAction, callback);
    //         return;
    //     }
    //     const noOfSrcRefs = srcRefs.length;
    //     const destRefs = subMergeAction.destRefs;
    //     const noOfDestRefs = destRefs.length;
    //     //const destProp = dpg(dr);
    //     for (let i = 0; i < noOfSrcRefs; i++) {
    //         const srcRef = srcRefs[i];
    //         const srcProp = spg(srcRef);
    //         for (let j = 0; j < noOfDestRefs; j++) {
    //             const destRef = destRefs[j];
    //             const destProp = dpg(destRef);
    //             //TODO:  Merge
    //             Object['assign'](destProp, srcProp);
    //             destRef.do(context, callback, destRef);
    //         }

    //     }
    // }

    // export interface IDoForEachAction<TContainer, TListItem> extends IAction {
    //     forEach?: (container: TContainer) => TListItem[];
    //     subActionsGenerator?: (container: TContainer) => [(listItem: TListItem) => IAction];
    // }
    //#endregion
    
    export interface ICacheStringValueAction extends IAction {
        cacheKey: string; //TODO:  symbol
        cacheValue: string;
        //fileReaderAction: ITextFileReaderAction;
    }
    export function cacheStringValueActionImpl(context: IContext, callback?: ICallback, action?: ICacheStringValueAction) {
        if(!action) action  = this;
        if(!context.stringCache) context.stringCache = {};
        context.stringCache[action.cacheKey] = action.cacheValue;
        endAction(action, callback);
    }

    export interface IBuildObjectPathAction extends IAction{
        objectGetter : Function
    }

    const __todo_name = '__todo_name';
    const __todo_parent = '__todo_parent'
    export function buildObjectPathActionImpl(context: IContext, callback?: ICallback, action?: IBuildObjectPathAction){
        if(action) action = this;

    }

    export function getParamName(objectGetter: Function){
        const functionStr = objectGetter.toString();
        //const afterReturn = functionStr.
    }

    export class test extends HTMLElement{

    }
}

// hook global op
declare const WorkerGlobalScope: any;

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
