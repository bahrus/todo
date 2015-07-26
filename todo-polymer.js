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
//<link is="todo-include" href="HTML1.html"/>
var includeExtension = {
    is: 'todo-include',
    extends: 'div',
    //from http://stackoverflow.com/questions/31053947/dynamically-load-html-page-using-polymer-importhref
    properties: {
        href: {
            type: String,
            observer: 'loadFile'
        }
    },
    loadFile: function (path) {
        var _this = this;
        if (this.href) {
            console.log(this.href);
            var link = this.importHref(this.href, function () {
                Polymer.dom(_this.$.content).appendChild(link.import.body);
            }, function () {
                console.log("error");
            });
        }
    }
};
var includeScript = Polymer(includeExtension);
//# sourceMappingURL=todo-polymer.js.map