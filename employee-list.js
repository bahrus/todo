///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
var todoTests;
(function (todoTests) {
    var test = 'test';
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
            this[test] = 'HTML1.html';
        },
        // listen: function (node, eventNamemethodName) {
        //     debugger;
        // },
        changeInclude: function () {
            debugger;
            this.set(test, 'HTML2.html');
        }
    });
    var _a;
})(todoTests || (todoTests = {}));
//# sourceMappingURL=employee-list.js.map