///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>

module todo.customElements {
    //<link is="todo-include" href="HTML1.html"/>
    const loadFileFn = 'loadFile';

    const includeExtension:polymer.Base = {
        is: 'todo-include',
        extends: 'link',
        //from http://stackoverflow.com/questions/31053947/dynamically-load-html-page-using-polymer-importhref
        properties: {
            href: {
                type: String,
                observer: loadFileFn,// 'loadFile'
            },
        },

        [loadFileFn]: function (path) {
            const that = eval('this'); //mystery why this is necessary
            if (that.href) {
                var link = that.importHref(that.href,
                    () => {
                        that.async(() => {
                            that.style.display = 'inline-block';
                            while(that.childElementCount > 0){
                                Polymer.dom(that).removeChild(that.firstChild);
                            }

                            Polymer.dom(that).appendChild(link.import.body.firstChild);
                        }, 1);

                    },
                    () => {
                        console.log("error");
                    }
                );
            }
        },


    };

    const includeScript = Polymer(includeExtension);
}
