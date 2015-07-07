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
	
	interface ISampleBuildTasks2 extends todo.IRecurringAction{
		htmlFileSelector?: todo.FileSystemActions.IFileSelectorAction;
		headActions: [SampleBuildTasks2ToAction];
		actions: [SampleBuildTasks2ToAction];
		testForRepeat?: (action: ISampleBuildTasks2) => boolean;
	}
	
	type SampleBuildTasks2ToAction = todo.IObjectGenerator<ISampleBuildTasks2, todo.IAction>;
	const sampleBuildTasks2 : ISampleBuildTasks2 = {
		do: todo.RecurringActionImpl,
		debug: true,
		testForRepeat: i => i.htmlFileSelector.state.hasNext,
		htmlFileSelector: {
			do: todo.FileSystemActions.FileSelectorActionImpl,
			fileTest: fsa.commonHelperFunctions.testForHtmlFileName,
		},
		headActions: [i => i.htmlFileSelector],
		actions: [i => <todo.IAction> i.htmlFileSelector.state],
		
	}
	
	const context: todo.IContext = {};
	sampleBuildTasks2.do(context);
	console.log(sampleBuildTasks2.htmlFileSelector.state.selectedFilePaths);
}