///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>
///<reference path='FileSystemActions.ts'/>

declare var global;
if(typeof(global) !== 'undefined'){
    require('./CommonActions');
	require('./FileSystemActions');
	//require('./NodeJSImplementations');
}

const ca = todo.CommonActions;
const fsa = todo.FileSystemActions;

type iConsoleAct = todo.CommonActions.IConsoleLogAction;
type iCompositeAct = todo.CommonActions.ICompositeActions;
type compToConsoleAction = todo.CommonActions.IObjectGenerator<iCompositeAct, iConsoleAct>;


const sendHelloWorldToConsole: iConsoleAct  = {
	do: ca.ConsoleLogActionImpl,
	message: `hello, world`
}

sendHelloWorldToConsole.do();

const sendYouveGotMaileToConsole: iConsoleAct = {
	do: ca.ConsoleLogActionImpl,
	message: `You've got mail`
}

const sendMessagesToConsole: iCompositeAct = {
	do: ca.CompositeActionsImpl,
	actions: [sendHelloWorldToConsole, sendYouveGotMaileToConsole]
}

sendMessagesToConsole.do();

interface IToDoList1 extends iCompositeAct {
	actions: [iConsoleAct, iConsoleAct, compToConsoleAction]
}

const sendMessagesToConsole2 : IToDoList1 = {
	do: ca.CompositeActionsImpl,
	actions: [
		{
			do: ca.ConsoleLogActionImpl,
			message: `This is foo`
		},
		{
			do: ca.ConsoleLogActionImpl,
			message: `That is bar`
		},
		cA => cA.actions[0]
	]
}

sendMessagesToConsole2.do();

type IToDoList2ToConsoleAction = todo.CommonActions.IObjectGenerator<IToDOList2, iConsoleAct>;

interface IToDOList2 extends iCompositeAct {
	consoleAction1: iConsoleAct,
	consoleAction2: iConsoleAct,
	consoleAction3: IToDoList2ToConsoleAction,
	actions: IToDoList2ToConsoleAction[],
}

const sendMessagesToConsole3: IToDOList2 = {
	do: ca.CompositeActionsImpl,
	consoleAction1:{
		do: ca.ConsoleLogActionImpl,
		message: `To Err is human.`
	},
	consoleAction2:{
		do: ca.ConsoleLogActionImpl,
		message: `To really foul things up requires a computer.`
	},
	consoleAction3: i => {
		const consoleMessage: iConsoleAct = {
			do: ca.ConsoleLogActionImpl,
			message: `${i.consoleAction1.message}  ${i.consoleAction2.message}`
		};
		return consoleMessage;
	},
	actions: [
		i => i.consoleAction1, i => i.consoleAction2, i=> i.consoleAction3
	]
}

sendMessagesToConsole3.do();

type IEchoFileToConsoleAction = todo.CommonActions.IObjectGenerator<IEchoFile, iConsoleAct>;

interface IEchoFile extends iCompositeAct{
	readFileAction: todo.FileSystemActions.ITextFileReaderAction;
	showFileContentsInConsole: IEchoFileToConsoleAction;
	cacheFileContents: todo.CommonActions.IObjectGenerator<IEchoFile, todo.CommonActions.ICacheStringValueAction>;
	actions: todo.CommonActions.IObjectGenerator<IEchoFile, todo.CommonActions.IAction>[]
}

const readAndDisplayFile : IEchoFile = {
	do: ca.CompositeActionsImpl,
	readFileAction: {
		do: todo.FileSystemActions.textFileReaderActionImpl,
		relativeFilePath: `.git\\config`,
	},
	showFileContentsInConsole : i => {
		const consoleMessage: iConsoleAct = {
			do: ca.ConsoleLogActionImpl,
			message: i.readFileAction.state.content
		};
		return consoleMessage;
	},
	cacheFileContents : i => {
		const cacheAction: todo.CommonActions.ICacheStringValueAction = {
			do: ca.cacheStringValueActionImpl,
			cacheKey: 'someKey',
			cacheValue: i.readFileAction.state.content,
		};
		return cacheAction;
	},
	actions:[
		i => i.readFileAction,
		//i => i.showFileContentsInConsole,
		i => i.cacheFileContents,
	]
}

const context : todo.CommonActions.IContext = {};
	
readAndDisplayFile.do(context);
console.log(context.stringCache['someKey']);
//const readFileAndLogContentsToConsole: 

