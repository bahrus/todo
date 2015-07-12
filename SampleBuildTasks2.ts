///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>


declare var global;
if(typeof global !== 'undefined'){
    require('./todo');
	require('./FileSystemActions');
	//require('./NodeJSImplementations');
}

module sampleBuildTasks2{
	const fsa = todo.FileSystemActions;
	
	export interface IDOMBuildDirectives extends todo.ICompositeActions, todo.DOMActions.IDOMElementBuildAction  {
        removeBuildDirective?: todo.DOMActions.IRemoveDOMElementAction;
        //makeJSClobDirective?: DOMActions.IDOMTransformAction;
        actions?: [
            todo.IObjectGenerator<IDOMBuildDirectives, todo.DOMActions.IRemoveDOMElementAction>
            //IObjectGenerator<IDOMBuildDirectives, DOMActions.IDOMTransformAction>
        ];
    }
	
	interface ISampleBuildTasks2 extends todo.IRecurringAction{
		htmlFileSelector?: todo.FileSystemActions.IHTMLFileSelectorAction,
		domBuildDirectives?: IDOMBuildDirectives,
		initActions: [SampleBuildTasks2ToAction];
		repeatingActions: [SampleBuildTasks2ToAction];
		testForRepeat?: (action: ISampleBuildTasks2) => boolean;
	}
	
	type SampleBuildTasks2ToAction = todo.IObjectGenerator<ISampleBuildTasks2, todo.IAction>;
	const sampleBuildTasks2 : ISampleBuildTasks2 = {
		do: todo.RecurringActionImpl,
		debug: true,
		testForRepeat: i => i.htmlFileSelector.filePathGenerator.hasNext,
		htmlFileSelector: {
			do: fsa.HTMLFileSelectorActionImpl,
			fileTest: fsa.commonHelperFunctions.testForHtmlFileName,
		},
		domBuildDirectives: {
			removeBuildDirective: {
	            do: todo.DOMActions.RemoveDOMElementActionImpl,
	            domState:{},
	            selector:{
	                cssSelector: 'todo-delete'
	            }
	        },
	        // makeJSClobDirective: {
	        //     do: DOMActions.DOMTransform,
	        //     selector: {
	        //         cssSelector: 'head>script[src]',
	        //         do: DOMActions.selectElements,
	        //         //debug: true,
	        //     },
	        //     elementAction: {
	        //         do: DOMActions.addToJSClob,
	        //     },
	        // },
	        actions: [
	            
	            i => {
	                i.removeBuildDirective.domState.htmlFile = i.domState.htmlFile
	                return i.removeBuildDirective;
	            },
	            // i => {
	            //     return i.makeJSClobDirective;
	            // }
	        ]
		},
		initActions: [i => i.htmlFileSelector],
		repeatingActions: [
			i => <todo.IAction> i.htmlFileSelector.filePathGenerator,
			i => {
				i.domBuildDirectives.domState = {
					htmlFile: i.htmlFileSelector.htmlFileSelectorState,
				};
				return i.domBuildDirectives;
			}
			 
		],
		
	}
	
	const context: todo.IContext = {};
	sampleBuildTasks2.do(context);
	console.log(sampleBuildTasks2.htmlFileSelector.filePathGenerator.selectedFilePaths);
}