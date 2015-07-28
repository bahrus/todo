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
        },
        changeInclude: function (e) {
            this.set(test, 'HTML2.html');
        }
    });
    var _a;
})(todoTests || (todoTests = {}));
//# sourceMappingURL=employee-list.js.map