///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>
var config = {
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
var todoInitScript = Polymer(config);
//# sourceMappingURL=todo-polymer.js.map