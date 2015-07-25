///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>

const config: polymer.Base = {
    is: 'todo-init',
    extends: 'script',

    created: () => {
        console.log(this);
        const that = <HTMLScriptElement> eval('this'); //mystery why this is necessary
        debugger;
        console.log(that);
        const target = <todo.Polymer.PolymerElement> that.previousElementSibling;
        if (target) {
            const inner = that.innerText;
            const action = eval(inner);
            action.polymerElement = target;
            //nextEl.__data__.employees.push({ first: 'Bruce', last: 'Anderson' });
            //target.push('employees', { first: 'Bruce', last: 'Anderson' });
            action.do();
        }
    },

    attached: () => {
        console.log(this);
        //debugger;
    },

    ready: () => {
        console.log(this);
        //debugger;
    },

    //instanceTemplate: (template) => {
    //    debugger;
    //    var dom = document.importNode(template['_content'] || template['content'], true);
    //    return <DocumentFragment> dom;
    //},
    
}; 

const todoInitScript = Polymer(config);


const config2: polymer.Base = {
    is: 'todo-init2',
    extends: 'script',

    created: () => {
        debugger;
    },

    attached: () => {
        console.log(this);
        //debugger;
    },

    ready: () => {
        console.log(this);
        //debugger;
    },

    //instanceTemplate: (template) => {
    //    debugger;
    //    var dom = document.importNode(template['_content'] || template['content'], true);
    //    return <DocumentFragment> dom;
    //},
    
}; 

const todoInitScript2 = Polymer(config2);