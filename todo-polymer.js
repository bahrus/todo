///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>
//<script is="todo-init">todoTests.pushMyName</script>
var initExtension = {
    is: 'todo-init',
    extends: 'script',
    attached: function () {
        var that = eval('this'); //mystery why this is necessary
        that.async(function () {
            var target = that.nextElementSibling;
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
            console.log(that.href);
            var link = that.importHref(that.href, function () {
                that.async(function () {
                    console.log(link.import.body);
                    console.log(that.parentNode);
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
var _a;
//# sourceMappingURL=todo-polymer.js.map