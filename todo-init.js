///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>
var todo;
(function (todo) {
    var customElements;
    (function (customElements) {
        function nextNonScriptSibling(el) {
            var nextElement = el.nextElementSibling;
            while (nextElement && nextElement.tagName === 'SCRIPT') {
                nextElement = nextElement.nextElementSibling;
            }
            return nextElement;
        }
        var initExtension = {
            is: 'todo-init',
            extends: 'script',
            properties: {
                allowedTargets: {
                    type: String
                }
            },
            attached: function () {
                var that = eval('this'); //mystery why this is necessary
                //const thisEl = <HTMLElement> that;
                //console.log(thisEl.parentNode);
                window.addEventListener('load', function (ev) {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var action = eval(inner);
                        action.targetElement = target;
                        action.do(null, null, action);
                    }
                });
            }
        };
        var todoInitScript = Polymer(initExtension);
        var attrExtension = {
            is: 'todo-attr',
            extends: 'script',
            attached: function () {
                var that = eval('this'); //mystery why this is necessary
                window.addEventListener('load', function (ev) {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var attributes = eval(inner);
                        for (var i = 0, n = attributes.length; i < n; i++) {
                            var attributePart = attributes[i];
                            for (var key in attributePart) {
                                //Polymer.dom(target).setAttribute(key,  attributePart[key]);
                                if (key.indexOf('on-') === 0) {
                                    var eventName = key.substring(3);
                                    that.domHost.listen(target, eventName, attributePart[key]);
                                }
                                else {
                                    Polymer.dom(target).setAttribute(key, attributePart[key]); //untested code
                                }
                            }
                        }
                    }
                });
            }
        };
        var attrScript = Polymer(attrExtension);
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-init.js.map