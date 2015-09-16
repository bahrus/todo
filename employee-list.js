///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
var todoTests;
(function (todoTests) {
    var test = 'test';
    todoTests.changeInclude = 'changeInclude';
    Polymer({
        is: 'employee-list',
        properties: (_a = {},
            _a[test] = String,
            _a
        ),
        ready: function () {
            //console.log(this);
            this.employees = [
                { first: 'Bob', last: 'Smith' },
                { first: 'Sally', last: 'Johnson' }
            ];
            this[test] = 'Employees';
        }
    });
    var _a;
})(todoTests || (todoTests = {}));
//# sourceMappingURL=employee-list.js.map