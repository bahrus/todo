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

    export interface IBindArgs{
        el: Element;
        bindOptions: IBindOptions;
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
                    bindings.forEach(binding =>{
                        let attrToChange = 'innerText';
                        if(binding.attr){
                            attrToChange = binding.attr;
                        }else{
                            switch(target.nodeName){
                                case 'input':
                                    attrToChange = 'value';
                            }
                        }
                        const bindArgs : IBindArgs = {
                            el: target,
                            bindOptions: binding,
                        };
                        if(binding.get){
                            const val = binding.get(bindArgs);
                            target['value'] = val;
                        }
                    });
                }
            });


        },


    };

    const bindScript = Polymer(bindExtension);

}