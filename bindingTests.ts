///<reference path='todo-bind.ts'/>
module bindingTests{
    export const myModel : {name: string; color: string} = {
        name: 'Bruce',
        color: 'red'
    };

    type ibo = todo.customElements.IBindOptions;

    export const spanExample : ibo[] = [
        {
            pull: e => myModel.name,
            attr: '#text', //optional
        },
        {
            pull: e => myModel.name,
            attr: 'title'
        },
        {
            get: e => myModel.color,
            attr: 'style'
        }
    ];

    export const divExample: ibo = {pull: e => myModel.name,};

    export const inputPushExample: ibo = {push: e => myModel.name};

    export const inputSyncExample: ibo = {sync: e => myModel.name};
}
