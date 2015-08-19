/**
 * Created by Bruce on 7/25/2015.
 */
///<reference path='PolymerActions.ts'/>

module todoTests{
    export const pushMyName : todo.PolymerActions.IPushIntoModelArrayAction<any> = {
        do: todo.PolymerActions.pushIntoModelArrayActionImpl,
        pathToArray: 'employees',
        arrayRef: [{ first: 'Bruce', last: 'Anderson' }],
    };

    export const storeTSConfig: todo.PolymerActions.IStoreResultAction = {

    }

    export const formDataSource: todo.PolymerActions.IXHRExtensionAction = {
        do: todo.PolymerActions.IXHRExtensionImpl,
        autoSubmit: true,
        successAction:{
            targetPath: 'tsConfig',
        }
    }
}