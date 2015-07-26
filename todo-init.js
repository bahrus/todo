///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>
var _this = this;
var config = {
    is: 'todo-init',
    extends: 'script',
    created: function () {
        console.log(_this);
        var that = eval('this'); //mystery why this is necessary
        console.log(that);
        return;
    },
    attached: function () {
        var that = eval('this'); //mystery why this is necessary
        that.async(function () {
            //setTimeout(() =>{
            var target = that.nextElementSibling;
            if (target) {
                var inner = that.innerText;
                var action = eval(inner);
                action.polymerElement = target;
                //nextEl.__data__.employees.push({ first: 'Bruce', last: 'Anderson' });
                //target.push('employees', { first: 'Bruce', last: 'Anderson' });
                action.do();
            }
            //})
        }, 1);
    },
    ready: function () {
    },
};
var todoInitScript = Polymer(config);
var config2 = {
    is: 'todo-init2',
    extends: 'script',
    created: function () {
        debugger;
    },
    attached: function () {
        console.log(_this);
        //debugger;
    },
    ready: function () {
        console.log(_this);
        //debugger;
    },
};
var todoInitScript2 = Polymer(config2);
//# sourceMappingURL=todo-init.js.map