///<reference path='Scripts/typings/node/node.d.ts'/>

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


module todo.CommonActions {
    

    export const versionKey = 'version';

    export interface IProcessManager {
        WaitForUserInputAndExit(message: string, testForExit: (chunk: string, key: any) => boolean);
    }


    export interface IContext {
        stringCache: { [key: string]: string };
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
    
    
    export interface IConsoleAction extends IAction {
        message?: stringOrStringGenerator;
        state?: IMessageState;
    }
    
    type stringOrStringGenerator = string | IObjectGenerator<IConsoleAction, string>;

    export function ConsoleActionImpl(context?: IContext, callback?: ICallback, consoleAction?: IConsoleAction) {
        let cA = consoleAction;
        if(!cA) cA = <IConsoleAction> this;
        let message: string;
        const messageOrMessageGenerator = cA.message;
        if(typeof messageOrMessageGenerator === 'string'){
            message = messageOrMessageGenerator;
        }else if(typeof messageOrMessageGenerator === 'function'){
            message = messageOrMessageGenerator(cA);
        }else{
            console.log(messageOrMessageGenerator);
            throw 'Not Supported Message Type';
        }
        cA.state = {
            dynamicMessage: message,
        };
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
    
    export function CompositeActionsImpl(context?: IContext, callback?: ICallback, action?: ICompositeActions){
        let cA = action;
        if(!cA) cA = this;
        if(!cA.actions) return;
        cA.actions.forEach(subAction => {
            doActionOrActionGenerator(context, callback, cA, subAction)
        });
    }
    
    // export interface ITypedActionList<T> extends IAction {
    //     configOneLiners?: [(t: T) => void];
    //     subActionsGenerator?: [(t: T) => IAction];
    // }

    // export function doSubActions<T>(action: ITypedActionList<T>, context: IContext, callback: ICallback) {
    //     const t = <T> <any> action;
    //     if (!action.subActionsGenerator || action.subActionsGenerator.length === 0) {
    //         endAction(action, callback);
    //         return;
    //     }
    //     const subActionGenerator = action.subActionsGenerator[0];
    //     const subAction = subActionGenerator(t);
    //     if (subAction.async) {
    //         const seqCallback: ICallback = (err) => {
    //             action.subActionsGenerator = <[(t: T) => IAction]> action.subActionsGenerator.slice(1);
    //             doSubActions(action, context, callback);
    //         };
    //         subAction.do(context, seqCallback, subAction); 
    //     } else {
    //         subAction.do(context, null, subAction);
    //         action.subActionsGenerator = <[(t: T) => IAction]> action.subActionsGenerator.slice(1);
    //         doSubActions(action, context, callback);
    //     } 
        
        
    // }

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

    export interface ISubMergeAction<TDestAction extends IAction, TSrc, TProp> {
        srcRefs: TSrc[];
        destRefs: TDestAction[];
        destinationPropertyGetter?: (destAction: TDestAction) => TProp;
        sourcePropertyGetter?: (src: TSrc) => TProp;
    }

    export function subMerge<TDestAction extends IAction, TSrc, TProp>(subMergeAction: ISubMergeAction<TDestAction, TSrc, TProp>, context: IContext, callback: ICallback) {
        const dpg = subMergeAction.destinationPropertyGetter;
        const spg = subMergeAction.sourcePropertyGetter;
        const srcRefs = subMergeAction.srcRefs;
        if (!srcRefs) {
            endAction(subMergeAction, callback);
            return;
        }
        const noOfSrcRefs = srcRefs.length;
        const destRefs = subMergeAction.destRefs;
        const noOfDestRefs = destRefs.length;
        //const destProp = dpg(dr);
        for (let i = 0; i < noOfSrcRefs; i++) {
            const srcRef = srcRefs[i];
            const srcProp = spg(srcRef);
            for (let j = 0; j < noOfDestRefs; j++) {
                const destRef = destRefs[j];
                const destProp = dpg(destRef);
                //TODO:  Merge
                Object['assign'](destProp, srcProp);
                destRef.do(context, callback, destRef);
            }

        }
    }

    export interface IDoForEachAction<TContainer, TListItem> extends IAction {
        forEach?: (container: TContainer) => TListItem[];
        subActionsGenerator?: (container: TContainer) => [(listItem: TListItem) => IAction];
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
