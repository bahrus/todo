/**
 * Created by Bruce on 7/25/2015.
 */
///<reference path='PolymerElementActions.ts'/>
var todoTests;
(function (todoTests) {
    todoTests.pushMyName = {
        do: todo.Polymer.pushIntoModelArrayActionImpl,
        pathToArray: 'employees',
        arrayRef: [{ first: 'Bruce', last: 'Anderson' }],
    };
})(todoTests || (todoTests = {}));
//# sourceMappingURL=todoInitTests.js.map