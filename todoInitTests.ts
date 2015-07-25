/**
 * Created by Bruce on 7/25/2015.
 */
///<reference path='PolymerElementActions.ts'/>

module todoTests{
    export const pushMyName : todo.Polymer.IPushIntoModelArrayAction = {
        do: todo.Polymer.pushIntoModelArrayActionImpl,
        pathToArray: 'employees',
        arrayRef: [{ first: 'Bruce', last: 'Anderson' }],
    };
}