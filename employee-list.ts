///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
module todoTests {
    const test = 'test';
    export const changeInclude = 'changeInclude';
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


        
        // listen: function (node, eventNamemethodName) {
        //     debugger;
        // },
        
        [changeInclude]: function() {
            this.set(test, 'HTML2.html');
        }
    });
}