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
        var loadFileFn = 'loadFile';
        //<link is="todo-include" href="HTML1.html"/>
        var includeExtension = (_a = {
                is: 'todo-include',
                extends: 'link',
                //from http://stackoverflow.com/questions/31053947/dynamically-load-html-page-using-polymer-importhref
                properties: {
                    href: {
                        type: String,
                        observer: loadFileFn
                    }
                }
            },
            _a[loadFileFn] = function (path) {
                var that = eval('this'); //mystery why this is necessary
                if (that.href) {
                    var link = that.importHref(that.href, function () {
                        that.async(function () {
                            that.style.display = 'inline-block';
                            Polymer.dom(that).appendChild(link.import.body.firstChild);
                        }, 1);
                    }, function () {
                        console.log("error");
                    });
                }
            },
            _a
        );
        var includeScript = Polymer(includeExtension);
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
        var maxValue = 'maxValue';
        var pixelHeight = 'pixelHeight';
        var pixelWidth = 'pixelWidth';
        var vScrollControl = {
            is: 'todo-vscroll',
            properties: (_b = {},
                _b[maxValue] = {
                    type: Number,
                    value: 1000
                },
                _b[pixelHeight] = {
                    type: Number,
                    value: 291
                },
                _b
            ),
            ready: function () {
                debugger;
                this.temp = 'i am here';
                this.outerStyle = 'color:red';
            }
        };
        var vScrollScript = Polymer(vScrollControl);
        var hScrollControl = {
            is: 'todo-hscroll',
            properties: (_c = {},
                _c[maxValue] = {
                    type: Number,
                    value: 100
                },
                _c[pixelWidth] = {
                    type: Number,
                    value: 317
                },
                _c
            )
        };
        var _a, _b, _c;
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-customElements.js.map