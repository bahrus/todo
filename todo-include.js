///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>
var todo;
(function (todo) {
    var customElements;
    (function (customElements) {
        //<link is="todo-include" href="HTML1.html"/>
        var loadFileFn = 'loadFile';
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
                            while (that.childElementCount > 0) {
                                Polymer.dom(that).removeChild(that.firstChild);
                            }
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
        var _a;
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-include.js.map