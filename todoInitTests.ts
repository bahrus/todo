/**
 * Created by Bruce on 7/25/2015.
 */
///<reference path='PolymerElementActions.ts'/>

module todoTests{
    export const pushMyName : todo.PolymerActions.IPushIntoModelArrayAction<any> = {
        do: todo.PolymerActions.pushIntoModelArrayActionImpl,
        pathToArray: 'employees',
        arrayRef: [{ first: 'Bruce', last: 'Anderson' }],
    };
}