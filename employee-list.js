///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
var todoTests;
(function (todoTests) {
    var test = 'test';
    var changeInclude = 'changeInclude';
    Polymer((_a = {
            is: 'employee-list',
            properties: (_b = {},
                _b[test] = String,
                _b
            ),
            ready: function () {
                //console.log(this);
                this.employees = [
                    { first: 'Bob', last: 'Smith' },
                    { first: 'Sally', last: 'Johnson' }
                ];
                this[test] = 'HTML1.html';
            }
        },
        // listen: function (node, eventNamemethodName) {
        //     debugger;
        // },
        _a[changeInclude] = function () {
            this.set(test, 'HTML2.html');
        },
        _a
    ));
    var _a, _b;
})(todoTests || (todoTests = {}));
//# sourceMappingURL=employee-list.js.map