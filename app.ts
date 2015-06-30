///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>
///<reference path='FileSystemActions.ts'/>

declare var global;
if(typeof(global) !== 'undefined'){
    require('./CommonActions');
	require('./FileSystemActions');
	require('./NodeJSImplementations');
}

const ca = todo.CommonActions;
const fsa = todo.FileSystemActions;

type iConsoleAct = todo.CommonActions.IConsoleAction;
type iCompositeAct = todo.CommonActions.ICompositeActions;
type compToConsoleAction = todo.CommonActions.IObjectGenerator<iCompositeAct, iConsoleAct>;


const sendHelloWorldToConsole: iConsoleAct  = {
	do: ca.ConsoleActionImpl,
	message: `hello, world`
}

sendHelloWorldToConsole.do();

const sendYouveGotMaileToConsole: iConsoleAct = {
	do: ca.ConsoleActionImpl,
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
			do: ca.ConsoleActionImpl,
			message: `This is foo`
		},
		{
			do: ca.ConsoleActionImpl,
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
		do: ca.ConsoleActionImpl,
		message: `To Err is human.`
	},
	consoleAction2:{
		do: ca.ConsoleActionImpl,
		message: `To really foul things up requires a computer.`
	},
	consoleAction3: i => {
		const consoleMessage: iConsoleAct = {
			do: ca.ConsoleActionImpl,
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
	actions: todo.CommonActions.IObjectGenerator<IEchoFile, todo.CommonActions.IAction>[]
}

const readAndDisplayFile : IEchoFile = {
	do: ca.CompositeActionsImpl,
	readFileAction: {
		do: todo.FileSystemActions.textFileReaderActionImpl,
		relativeFilePath: `Scripts\\typings\\node\\node.d.ts`,
		// rootDirectoryRetriever: fsa.commonHelperFunctions.retrieveWorkingDirectory
	},
	showFileContentsInConsole : i => {
		const consoleMessage: iConsoleAct = {
			do: ca.ConsoleActionImpl,
			message: i.readFileAction.state.content
		}
		return consoleMessage;
	},
	actions:[
		i => i.readFileAction,
		i => i.showFileContentsInConsole,
	]
}

const context : todo.FileSystemActions.IWebContext = {
	HTMLOutputs: {},
	JSOutputs: {},
	stringCache: {},
	fileManager: new todo.NodeJSImplementations.NodeJSWebFileManager(),
}
readAndDisplayFile.do(context);
//const readFileAndLogContentsToConsole: 

