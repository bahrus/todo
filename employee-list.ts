///<reference path='Scripts/typings/polymer/polymer.d.ts'/>

Polymer({
    is: 'employee-list',

    ready: function () {
        //console.log(this);
        this.employees = [
            { first: 'Bob', last: 'Smith' },
            { first: 'Sally', last: 'Johnson' }
        ];
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