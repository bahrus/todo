///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>
if (typeof global !== 'undefined') {
    require('./todo');
    require('./FileSystemActions');
}
var todo;
(function (todo) {
    var DOMActions;
    (function (DOMActions) {
        var su = todo.StringUtils || global.todo.StringUtils;
        var fsa = todo.FileSystemActions || global.todo.FileSystemActions;
        function RemoveDOMElementActionImpl(context, callback, action) {
            if (!action)
                action = this;
            if (!action.selector.do)
                action.selector.do = DOMElementCSSSelectorImpl;
            action.selector.domState = action.domState;
            action.selector.do(context, null, action.selector);
            action.domState.elements.remove();
            todo.endAction(action, callback);
        }
        DOMActions.RemoveDOMElementActionImpl = RemoveDOMElementActionImpl;
        function DOMElementCSSSelectorImpl(context, callback, action) {
            if (action.debug)
                debugger;
            var aS = action.domState;
            if (aS.relativeTo) {
                aS.elements = aS.relativeTo.find(action.cssSelector);
            }
            else {
                //aS.elements = aS.$(action.cssSelector);
                aS.elements = aS.htmlFile.$(action.cssSelector);
            }
            todo.endAction(action, callback);
        }
        DOMActions.DOMElementCSSSelectorImpl = DOMElementCSSSelectorImpl;
        function DOMTransform(context, callback, action) {
            var elements;
            var p;
            if (action.domState) {
                p = action.domState.parent;
            }
            var aSel = action.selector;
            if (!aSel.domState) {
                aSel.domState = {
                    htmlFile: action.domState.htmlFile
                };
            }
            var aSelSt = aSel.domState;
            aSelSt.treeNode = action;
            if (p && p.elementAction) {
                aSelSt.relativeTo = p.elementAction.domState.elements;
            }
            aSel.do(context, null, aSel);
            var eA = action.elementAction;
            if (eA) {
                //#region element Action
                eA.domState = {
                    elements: null,
                    DOMTransform: action,
                    htmlFile: aSelSt.htmlFile
                };
                if (eA.async) {
                    var i = 0;
                    var n = aSelSt.elements.length;
                    var eACallback = function (err) {
                        if (i < n) {
                            var $elem = aSelSt.htmlFile.$(aSelSt.elements[i]);
                            i++;
                            eA.domState.elements = $elem;
                            eA.do(context, eACallback, eA);
                        }
                        else {
                            todo.endAction(action, callback);
                        }
                    };
                    eACallback(null);
                }
                else {
                    var n = aSelSt.elements.length;
                    for (var i = 0; i < n; i++) {
                        var $elem = aSelSt.htmlFile.$(aSelSt.elements[i]);
                        eA.domState.elements = $elem;
                        eA.do(context, null, eA);
                    }
                    todo.endAction(action, callback);
                }
            }
            else {
                todo.endAction(action, callback);
            }
        }
        DOMActions.DOMTransform = DOMTransform;
    })(DOMActions = todo.DOMActions || (todo.DOMActions = {}));
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
//# sourceMappingURL=DOMActions.js.map