///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>

const config: polymer.Base = {
    is: 'todo-init',
    extends: 'script',

    
    attached: () => {
        const that =   eval('this'); //mystery why this is necessary
        that.async(() => {
            const target = <todo.Polymer.PolymerElement> that.nextElementSibling;
            if (target) {
                const inner = that.innerText;
                const action = eval(inner);
                action.polymerElement = target;
                action.do();
            }
        }, 1);
    },

    
    
}; 

const todoInitScript = Polymer(config);


