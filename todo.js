///<reference path='Scripts/typings/node/node.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    todo.versionKey = 'version';
    function endAction(action, callback) {
        if (callback)
            callback(null);
    }
    todo.endAction = endAction;
    function ConsoleLogActionImpl(context, callback, consoleAction) {
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
            cA.domState = {
                dynamicMessage: message
            };
        }
        else {
            console.log(messageOrMessageGenerator);
            throw 'Not Supported Message Type';
        }
        console.log(message);
    }
    todo.ConsoleLogActionImpl = ConsoleLogActionImpl;
    function doActionOrActionGenerator(context, callback, action, subAction) {
        var generatedAction;
        if (typeof subAction === 'object') {
            generatedAction = subAction;
        }
        else if (typeof subAction === 'function') {
            var actionGenerator = subAction;
            generatedAction = actionGenerator(action);
            if (typeof generatedAction === 'function') {
                doActionOrActionGenerator(context, callback, action, generatedAction);
                return;
            }
        }
        else {
            throw 'Action Type not supported.';
        }
        generatedAction.do(context, callback, generatedAction);
    }
    function doActions(context, callback, action, actions) {
        actions.forEach(function (subAction) {
            doActionOrActionGenerator(context, callback, action, subAction);
        });
    }
    function CompositeActionsImpl(context, callback, action) {
        var thisAction = action;
        if (!thisAction)
            thisAction = this;
        if (!thisAction.actions) {
            console.warn('No actions found!');
            return;
        }
        doActions(context, callback, thisAction, thisAction.actions);
    }
    todo.CompositeActionsImpl = CompositeActionsImpl;
    function RecurringActionImpl(context, callback, action) {
        var thisAction = action;
        if (!thisAction)
            thisAction = this;
        if (!thisAction.initActions && !thisAction.repeatingActions && !thisAction.finalActions) {
            console.warn('No actions found!');
            return;
        }
        if (thisAction.initActions)
            doActions(context, callback, thisAction, thisAction.initActions);
        while (thisAction.testForRepeat(thisAction)) {
            doActions(context, callback, thisAction, thisAction.repeatingActions);
        }
        if (thisAction.finalActions)
            doActions(context, callback, thisAction, thisAction.finalActions);
    }
    todo.RecurringActionImpl = RecurringActionImpl;
    function merge(mergeAction, context, callback) {
        var n = mergeAction.srcRefs.length;
        for (var i = 0; i < n; i++) {
            var srcRef = mergeAction.srcRefs[i];
            //TODO:  implement merge
            Object['assign'](mergeAction.destRef, srcRef);
        }
    }
    todo.merge = merge;
    function cacheStringValueActionImpl(context, callback, action) {
        if (!action)
            action = this;
        if (!context.stringCache)
            context.stringCache = {};
        context.stringCache[action.cacheKey] = action.cacheValue;
        endAction(action, callback);
    }
    todo.cacheStringValueActionImpl = cacheStringValueActionImpl;
    var __todo_name = '__todo_name';
    var __todo_parent = '__todo_parent';
    function buildObjectPathActionImpl(context, callback, action) {
        if (action)
            action = this;
    }
    todo.buildObjectPathActionImpl = buildObjectPathActionImpl;
    function getParamName(objectGetter) {
        var functionStr = objectGetter.toString();
        //const afterReturn = functionStr.
    }
    todo.getParamName = getParamName;
    var test = (function (_super) {
        __extends(test, _super);
        function test() {
            _super.apply(this, arguments);
        }
        return test;
    })(HTMLElement);
    todo.test = test;
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
//# sourceMappingURL=todo.js.map