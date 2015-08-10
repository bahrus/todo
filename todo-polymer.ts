///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>

module todo.customElements {
    

    
    
    function nextNonScriptSibling(el: HTMLElement) : Element{
        let nextElement = el.nextElementSibling;
        while(nextElement && nextElement.tagName === 'SCRIPT'){
            nextElement = nextElement.nextElementSibling;
        }
        return nextElement;
    }
    const initExtension: polymer.Base = {
        is: 'todo-init',
        extends: 'script',
        properties: {
            allowedTargets: {
                type: String, //used for compile time checks

            },
        },
        
        attached: () => {
            const that =   eval('this'); //mystery why this is necessary
            that.async(() => {
                const target = <todo.PolymerActions.PolymerElement> nextNonScriptSibling(that);
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
            },
        },
    
        [loadFileFn]: function(path) {
            const that =   eval('this'); //mystery why this is necessary
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
    
    const attrExtension: polymer.Base = {
        is: 'todo-attr',
        extends: 'script',
    
        
        attached: () => {
            const that =   eval('this'); //mystery why this is necessary
            that.async(() => {
                const target = <todo.PolymerActions.PolymerElement> nextNonScriptSibling(that) ;
                if (target) {
                    const inner = that.innerText;
                    const attributes = eval(inner);
                    for(var i = 0, n = attributes.length; i < n; i++){
                        const attributePart = attributes[i];
                        for(const key in attributePart){
                            //Polymer.dom(target).setAttribute(key,  attributePart[key]);
                            if(key.indexOf('on-') === 0){
                                const eventName = key.substring(3);
                                that.domHost.listen(target, eventName, attributePart[key]);
                            }else{
                                Polymer.dom(target).setAttribute(key,  attributePart[key]); //untested code
                            }
                            
                        }
                    }
                    
                }
            }, 1);
        },
   
    }; 
    
    const attrScript = Polymer(attrExtension);


}
