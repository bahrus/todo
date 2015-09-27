///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
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
        var bindExtension = {
            is: 'todo-bind',
            extends: 'script',
            //properties: {
            //
            //},
            attached: function () {
                var that = eval('this'); //mystery why this is necessary
                window.addEventListener('load', function (ev) {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var action = eval(inner);
                        var bindings;
                        if (action.constructor.toString().indexOf('Array') === -1) {
                            bindings = [action];
                        }
                        else {
                            bindings = action;
                        }
                        bindings.forEach(function (binding) {
                            var attrToChange = 'innerText';
                            if (binding.attr) {
                                attrToChange = binding.attr;
                            }
                            else {
                                switch (target.nodeName) {
                                    case 'input':
                                        attrToChange = 'value';
                                }
                            }
                            var bindArgs = {
                                el: target,
                                bindOptions: binding
                            };
                            if (binding.get) {
                                var val = binding.get(bindArgs);
                                target['value'] = val;
                            }
                        });
                    }
                });
            }
        };
        var bindScript = Polymer(bindExtension);
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-bind.js.map