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
            this[test] = 'iah';
        },
        //instanceTemplate: function (template) {
        //    //debugger;
        //    var dom = document.importNode(template._content || template.content, true);
        //    return dom;
        //},
        //scopeSubtree: function (a, b) {
        //    debugger;
        //}
        listen: function (node, eventNamemethodName) {
            debugger;
        }
    });
    var _a;
})(todoTests || (todoTests = {}));
//# sourceMappingURL=employee-list.js.map