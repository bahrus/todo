///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>
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
        function addToJSClob(context, callback, action) {
            var state = action.domState;
            var src = action.domState.elements.attr('src');
            fsa.commonHelperFunctions.assignFileManager(context);
            var webContext = context;
            var referringDir = webContext.fileManager.resolve(state.htmlFile.filePath, '..', src);
            if (!webContext.JSOutputs)
                webContext.JSOutputs = {};
            var jsOutputs = webContext.JSOutputs;
            if (!jsOutputs[referringDir])
                jsOutputs[state.htmlFile.filePath] = [];
            var minifiedVersionFilePath = su.replaceEndWith(referringDir, '.js', '.min.js');
            if (!webContext.fileManager.doesFilePathExist(minifiedVersionFilePath)) {
                console.log('minified filepath ' + minifiedVersionFilePath + ' does not exist.');
                todo.endAction(action, callback);
                return;
            }
            var minifiedContent = webContext.fileManager.readTextFileSync(minifiedVersionFilePath);
            jsOutputs[state.htmlFile.filePath].push(minifiedContent);
            action.domState.elements.remove();
            todo.endAction(action, callback);
        }
        DOMActions.addToJSClob = addToJSClob;
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
                    htmlFile: action.domState.htmlFile,
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
                    htmlFile: aSelSt.htmlFile,
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
//# sourceMappingURL=DOMActions.js.map