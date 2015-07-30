///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>
//<script is="todo-init">todoTests.pushMyName</script>
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
            attached: function () {
                var that = eval('this'); //mystery why this is necessary
                that.async(function () {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var action = eval(inner);
                        action.polymerElement = target;
                        action.do();
                    }
                }, 1);
            },
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
                        observer: loadFileFn,
                    }
                }
            },
            _a[loadFileFn] = function (path) {
                var that = eval('this');
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
                that.async(function () {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var attributes = eval(inner);
                        for (var i = 0, n = attributes.length; i < n; i++) {
                            var attributePart = attributes[i];
                            for (var key in attributePart) {
                                //Polymer.dom(target).setAttribute(key,  attributePart[key]);
                                that.domHost.listen(target, 'click', attributePart[key]);
                            }
                        }
                    }
                }, 1);
            },
        };
        var attrScript = Polymer(attrExtension);
        var _a;
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-polymer.js.map