///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
var _this = this;
var config = {
    is: 'todo-init',
    extends: 'script',
    created: function () {
        //console.log(this);
        var that = eval('this');
        debugger;
        console.log(that);
        var target = that.previousElementSibling;
        if (target) {
            debugger;
            //nextEl.__data__.employees.push({ first: 'Bruce', last: 'Anderson' });
            target.push('employees', { first: 'Bruce', last: 'Anderson' });
        }
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