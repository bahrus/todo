/**
 * Created by Bruce on 7/25/2015.
 */
///<reference path='PolymerActions.ts'/>
var todoTests;
(function (todoTests) {
    todoTests.pushMyName = {
        do: todo.PolymerActions.pushIntoModelArrayActionImpl,
        pathToArray: 'employees',
        arrayRef: [{ first: 'Bruce', last: 'Anderson' }]
    };
    todoTests.formDataSource = {
        do: todo.PolymerActions.IXHRExtensionImpl,
        autoSubmit: true,
        successAction: {
            targetPath: 'tsConfig'
        }
    };
})(todoTests || (todoTests = {}));
//# sourceMappingURL=initTests.js.map