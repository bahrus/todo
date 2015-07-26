///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>

//<script is="todo-init">todoTests.pushMyName</script>
const initExtension: polymer.Base = {
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

const todoInitScript = Polymer(initExtension);

//<link is="todo-include" href="HTML1.html"/>
const includeExtension: polymer.Base = {
    is: 'todo-include',
    extends: 'div',
    //from http://stackoverflow.com/questions/31053947/dynamically-load-html-page-using-polymer-importhref
    properties: {
        href: {
          type: String,
          observer: 'loadFile'
        }
    },

    loadFile: function(path) {
        if (this.href) {
            console.log(this.href);
            var link = this.importHref(this.href, 
                () => {
                    Polymer.dom(this.$.content).appendChild(link.import.body);
                },
                () => {
                console.log("error");
                }
            );
        }
    }
}

const includeScript = Polymer(includeExtension);
