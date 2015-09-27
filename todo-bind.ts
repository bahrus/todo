///<reference path='Scripts/typings/polymer/polymer.d.ts'/>

module todo.customElements{

    export interface IBindOptions{
        pull?: Function;
        push?: Function;
        sync?: Function;
        get?: Function;
        set?: Function;
        attr?: string;
    }

    function nextNonScriptSibling(el:HTMLElement):Element {
        let nextElement = el.nextElementSibling;
        while (nextElement && nextElement.tagName === 'SCRIPT') {
            nextElement = nextElement.nextElementSibling;
        }
        return nextElement;
    }

    const bindExtension:polymer.Base = {
        is: 'todo-bind',
        extends: 'script',
        //properties: {
        //
        //},

        attached: () => {
            const that = eval('this'); //mystery why this is necessary


            window.addEventListener('load', ev => {
                const target = nextNonScriptSibling(that);
                if (target) {
                    const inner = that.innerText;
                    const action = eval(inner);
                    let bindings : IBindOptions[];
                    if (action.constructor.toString().indexOf('Array') === -1){
                        bindings = [<IBindOptions> action];
                    }else{
                        bindings = <IBindOptions[]> action;
                    }
                    debugger;
                }
            });


        },


    };

    const bindScript = Polymer(bindExtension);

}