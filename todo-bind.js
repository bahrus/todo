///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
var todo;
(function (todo) {
    var customElements;
    (function (customElements) {
        var fnSignature = 'return ';
        var fnSignatureLn = fnSignature.length;
        function nextNonScriptSibling(el) {
            var nextElement = el.nextElementSibling;
            while (nextElement && nextElement.tagName === 'SCRIPT') {
                nextElement = nextElement.nextElementSibling;
            }
            return nextElement;
        }
        function analyzeFunctionRef(fnString) {
            var iPosReturn = fnString.indexOf(fnSignature);
            fnString = fnString.substr(iPosReturn + fnSignatureLn);
            var iPosSemi = fnString.indexOf(';');
            fnString = fnString.substr(0, iPosSemi);
            console.log(fnString);
            var iPosOfLastDot = fnString.lastIndexOf('.');
            if (iPosOfLastDot > -1) {
                var fnObj = fnString.substr(0, iPosOfLastDot);
                var obj = eval(fnObj);
                var fieldOrProp = fnString.substr(iPosOfLastDot).substr(1);
                return {
                    obj: obj,
                    fieldOrProp: fieldOrProp
                };
            }
            return null;
        }
        var bindExtension = {
            is: 'todo-bind',
            extends: 'script',
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
                                    case 'INPUT':
                                        attrToChange = 'value';
                                }
                            }
                            var bindArgs = {
                                el: target,
                                bindOptions: binding
                            };
                            if (binding.get) {
                                var val = binding.get(bindArgs);
                                target[attrToChange] = val;
                            }
                            if (binding.set) {
                                var val = target[attrToChange];
                                var objRef = analyzeFunctionRef(binding.set.toString());
                                objRef.obj[objRef.fieldOrProp] = val;
                            }
                            if (binding.pull) {
                                var objRef = analyzeFunctionRef(binding.pull.toString());
                                Object['observe'](objRef.obj, function (changes) {
                                    changes.forEach(function (change) {
                                        if (change.name !== objRef.fieldOrProp)
                                            return;
                                        target[attrToChange] = change.object[objRef.fieldOrProp];
                                    });
                                    console.log(changes);
                                });
                            }
                            if (binding.push) {
                                var observer = new MutationObserver(function (mutations) {
                                    console.log(mutations);
                                });
                                var mutationConfig = {
                                    attributes: true
                                };
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