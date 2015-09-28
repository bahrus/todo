///<reference path='Scripts/typings/polymer/polymer.d.ts'/>

module todo.customElements{

    const fnSignature = 'return ';
    const fnSignatureLn = fnSignature.length;

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

    function analyzeFunctionRef(fnString: string) : {obj: Object; fieldOrProp: string} {
        const iPosReturn = fnString.indexOf(fnSignature);
        fnString = fnString.substr(iPosReturn + fnSignatureLn);
        const iPosSemi = fnString.indexOf(';');
        fnString = fnString.substr(0, iPosSemi);
        console.log(fnString);
        const iPosOfLastDot = fnString.lastIndexOf('.');
        if(iPosOfLastDot > -1){
            const fnObj = fnString.substr(0, iPosOfLastDot);
            const obj = eval(fnObj);
            const fieldOrProp = fnString.substr(iPosOfLastDot).substr(1);
            return {
               obj: obj,
                fieldOrProp: fieldOrProp
            };
        }
        return null;
    }

    const bindExtension:polymer.Base = {
        is: 'todo-bind',
        extends: 'script',


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
                                case 'INPUT':
                                    attrToChange = 'value';
                            }
                        }
                        const bindArgs : IBindArgs = {
                            el: target,
                            bindOptions: binding,
                        };
                        if(binding.get){
                            const val = binding.get(bindArgs);
                            target[attrToChange] = val;
                        }
                        if(binding.set){
                            const val = target[attrToChange];
                            const objRef = analyzeFunctionRef(binding.set.toString());
                            objRef.obj[objRef.fieldOrProp] = val;
                        }
                        if(binding.pull){
                            const objRef = analyzeFunctionRef(binding.pull.toString());
                            Object['observe'](objRef.obj, changes => {
                                changes.forEach(change =>{
                                    if(change.name !== objRef.fieldOrProp) return;
                                    target[attrToChange] =  change.object[objRef.fieldOrProp];
                                });

                                console.log(changes);
                            });
                        }
                    });
                }
            });


        },


    };

    const bindScript = Polymer(bindExtension);

}