///<reference path='Scripts/typings/node/node.d.ts'/>
if (!Object['assign']) {
    //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
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
var todo;
(function (todo) {
    var CommonActions;
    (function (CommonActions) {
        CommonActions.versionKey = 'version';
        function endAction(action, callback) {
            if (callback)
                callback(null);
        }
        CommonActions.endAction = endAction;
        function ConsoleActionImpl(context, callback, consoleAction) {
            var cA = consoleAction;
            if (!cA)
                cA = this;
            var message;
            var messageOrMessageGenerator = cA.message;
            if (typeof messageOrMessageGenerator === 'string') {
                message = messageOrMessageGenerator;
            }
            else if (typeof messageOrMessageGenerator === 'function') {
                message = messageOrMessageGenerator(cA);
            }
            else {
                throw 'Not Supported Message Type';
            }
            cA.state = {
                dynamicMessage: message,
            };
            console.log(message);
        }
        CommonActions.ConsoleActionImpl = ConsoleActionImpl;
        function CompositeActionsImpl(context, callback, action) {
            var cA = action;
            if (!cA)
                cA = this;
            if (!cA.actions)
                return;
            cA.actions.forEach(function (action) {
                var generatedAction;
                if (typeof action === 'object') {
                    generatedAction = action;
                }
                else {
                    var actionGenerator = action;
                    var generatedAction_1 = actionGenerator(cA);
                }
                generatedAction.do(context, callback, action);
            });
        }
        CommonActions.CompositeActionsImpl = CompositeActionsImpl;
        function doSubActions(action, context, callback) {
            var t = action;
            if (!action.subActionsGenerator || action.subActionsGenerator.length === 0) {
                endAction(action, callback);
                return;
            }
            var subActionGenerator = action.subActionsGenerator[0];
            var subAction = subActionGenerator(t);
            if (subAction.async) {
                var seqCallback = function (err) {
                    action.subActionsGenerator = action.subActionsGenerator.slice(1);
                    doSubActions(action, context, callback);
                };
                subAction.do(context, seqCallback, subAction);
            }
            else {
                subAction.do(context, null, subAction);
                action.subActionsGenerator = action.subActionsGenerator.slice(1);
                doSubActions(action, context, callback);
            }
        }
        CommonActions.doSubActions = doSubActions;
        function merge(mergeAction, context, callback) {
            var n = mergeAction.srcRefs.length;
            for (var i = 0; i < n; i++) {
                var srcRef = mergeAction.srcRefs[i];
                //TODO:  implement merge
                Object['assign'](mergeAction.destRef, srcRef);
            }
        }
        CommonActions.merge = merge;
        function subMerge(subMergeAction, context, callback) {
            var dpg = subMergeAction.destinationPropertyGetter;
            var spg = subMergeAction.sourcePropertyGetter;
            var srcRefs = subMergeAction.srcRefs;
            if (!srcRefs) {
                endAction(subMergeAction, callback);
                return;
            }
            var noOfSrcRefs = srcRefs.length;
            var destRefs = subMergeAction.destRefs;
            var noOfDestRefs = destRefs.length;
            //const destProp = dpg(dr);
            for (var i = 0; i < noOfSrcRefs; i++) {
                var srcRef = srcRefs[i];
                var srcProp = spg(srcRef);
                for (var j = 0; j < noOfDestRefs; j++) {
                    var destRef = destRefs[j];
                    var destProp = dpg(destRef);
                    //TODO:  Merge
                    Object['assign'](destProp, srcProp);
                    destRef.do(context, callback, destRef);
                }
            }
        }
        CommonActions.subMerge = subMerge;
    })(CommonActions = todo.CommonActions || (todo.CommonActions = {}));
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
//# sourceMappingURL=CommonActions.js.map