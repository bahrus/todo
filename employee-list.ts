///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
module todoTests {
    const test = 'test';
    Polymer({
        is: 'employee-list',
        properties: {
            [test]: String    // no notify:true!
        },
        ready: function () {
            //console.log(this);
            this.employees = [
                {first: 'Bob', last: 'Smith'},
                {first: 'Sally', last: 'Johnson'}
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
        }
    });
}