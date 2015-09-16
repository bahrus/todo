///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>

module todo.customElements {


    function nextNonScriptSibling(el:HTMLElement):Element {
        let nextElement = el.nextElementSibling;
        while (nextElement && nextElement.tagName === 'SCRIPT') {
            nextElement = nextElement.nextElementSibling;
        }
        return nextElement;
    }

    const initExtension:polymer.Base = {
        is: 'todo-init',
        extends: 'script',
        properties: {
            allowedTargets: {
                type: String, //used for compile time checks

            },
        },

        attached: () => {
            const that = eval('this'); //mystery why this is necessary
            //const thisEl = <HTMLElement> that;
            //console.log(thisEl.parentNode);

            window.addEventListener('load', ev => {
                const target = <todo.PolymerActions.PolymerElement> nextNonScriptSibling(that);
                if (target) {
                    const inner = that.innerText;
                    const action = <todo.PolymerActions.IPolymerAction> eval(inner);
                    action.targetElement = target;
                    action.do(null, null, action);
                }
            });


        },


    };

    const todoInitScript = Polymer(initExtension);





    const attrExtension:polymer.Base = {
        is: 'todo-attr',
        extends: 'script',


        attached: () => {
            const that = eval('this'); //mystery why this is necessary
            window.addEventListener('load', ev => {
                const target = <todo.PolymerActions.PolymerElement> nextNonScriptSibling(that);
                if (target) {
                    const inner = that.innerText;
                    const attributes = eval(inner);
                    for (var i = 0, n = attributes.length; i < n; i++) {
                        const attributePart = attributes[i];
                        for (const key in attributePart) {
                            //Polymer.dom(target).setAttribute(key,  attributePart[key]);
                            if (key.indexOf('on-') === 0) {
                                const eventName = key.substring(3);
                                that.domHost.listen(target, eventName, attributePart[key]);
                            } else {
                                Polymer.dom(target).setAttribute(key, attributePart[key]); //untested code
                            }

                        }
                    }

                }
            });
        },

    };

    const attrScript = Polymer(attrExtension);
}
