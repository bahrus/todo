///<reference path='todo-bind.ts'/>
module bindingTests{
    export const myModel : {name: string; color: string; address: string} = {
        name: 'Bruce',
        address: '',
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

    export const divExample: ibo = {pull: e => myModel.address,};

    export const inputGetExample: ibo = {get: e => myModel.name};

    export const inputSetExample: ibo = {set: e => myModel.address};

    export const inputPushExample: ibo = {push: e => myModel.address};
}
