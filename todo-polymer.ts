///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerElementActions.ts'/>

//<script is="todo-init">todoTests.pushMyName</script>
module todo.customElements {
    
    const initExtension: polymer.Base = {
        is: 'todo-init',
        extends: 'script',
    
        
        attached: () => {
            const that =   eval('this'); //mystery why this is necessary
            that.async(() => {
                const target = <todo.PolymerActions.PolymerElement> that.nextElementSibling;
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
    
    const loadFileFn = 'loadFile';
    
    //<link is="todo-include" href="HTML1.html"/>
    const includeExtension: polymer.Base = {
        is: 'todo-include',
        extends: 'link',
        //from http://stackoverflow.com/questions/31053947/dynamically-load-html-page-using-polymer-importhref
        properties: {
            href: {
              type: String,
              observer: loadFileFn,// 'loadFile'
            }
        },
    
        [loadFileFn]: function(path) {
            const that =   eval('this'); 
            if (that.href) {
                var link = that.importHref(that.href, 
                    () => {
                        that.async(() =>{
                            that.style.display = 'inline-block';
                            Polymer.dom(that).appendChild(link.import.body.firstChild);
                        }, 1);
                        
                    },
                    () => {
                        console.log("error");
                    }
                );
            }
        },
        
       
    }
    
    const includeScript = Polymer(includeExtension);
}
