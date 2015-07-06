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
		actions?: [compToConsoleAction];
		testForRepeat?: (action: ISampleBuildTasks2) => boolean;
	}
	
	type compToConsoleAction = todo.IObjectGenerator<ISampleBuildTasks2, todo.IAction>;
	const sampleBuildTasks2 : ISampleBuildTasks2 = {
		do: todo.RecurringActionImpl,
		testForRepeat: i => i.htmlFileSelector.state.hasNext,
		htmlFileSelector: {
			do: todo.FileSystemActions.FileSelectorActionImpl,
			fileTest: fsa.commonHelperFunctions.testForHtmlFileName,
		},
		actions: [i => i.htmlFileSelector],
	}
	
	const context: todo.IContext = {};
	sampleBuildTasks2.do(context);
	console.log(sampleBuildTasks2.htmlFileSelector.state.selectedFilePaths);
}