///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>

declare var global;
if(typeof(global) !== 'undefined'){
    require('./todo');
	require('./FileSystemActions');
	//require('./NodeJSImplementations');
}

//const ca = todo.CommonActions;
const fsa = todo.FileSystemActions;

type iConsoleAct = todo.IConsoleLogAction;
type iCompositeAct = todo.ICompositeActions;
type compToConsoleAction = todo.IObjectGenerator<iCompositeAct, iConsoleAct>;


const sendHelloWorldToConsole: iConsoleAct  = {
	do: todo.ConsoleLogActionImpl,
	message: `hello, world`
}

sendHelloWorldToConsole.do();

const sendYouveGotMaileToConsole: iConsoleAct = {
	do: todo.ConsoleLogActionImpl,
	message: `You've got mail`
}

const sendMessagesToConsole: iCompositeAct = {
	do: todo.CompositeActionsImpl,
	actions: [sendHelloWorldToConsole, sendYouveGotMaileToConsole]
}

sendMessagesToConsole.do();

interface IToDoList1 extends iCompositeAct {
	actions: [iConsoleAct, iConsoleAct, compToConsoleAction]
}

const sendMessagesToConsole2 : IToDoList1 = {
	do: todo.CompositeActionsImpl,
	actions: [
		{
			do: todo.ConsoleLogActionImpl,
			message: `This is foo`
		},
		{
			do: todo.ConsoleLogActionImpl,
			message: `That is bar`
		},
		cA => cA.actions[0]
	]
}

sendMessagesToConsole2.do();

type IToDoList2ToConsoleAction = todo.IObjectGenerator<IToDOList2, iConsoleAct>;

interface IToDOList2 extends iCompositeAct {
	consoleAction1: iConsoleAct,
	consoleAction2: iConsoleAct,
	consoleAction3: IToDoList2ToConsoleAction,
	actions: IToDoList2ToConsoleAction[],
}

const sendMessagesToConsole3: IToDOList2 = {
	do: todo.CompositeActionsImpl,
	consoleAction1:{
		do: todo.ConsoleLogActionImpl,
		message: `To Err is human.`
	},
	consoleAction2:{
		do: todo.ConsoleLogActionImpl,
		message: `To really foul things up requires a computer.`
	},
	consoleAction3: i => {
		const consoleMessage: iConsoleAct = {
			do: todo.ConsoleLogActionImpl,
			message: `${i.consoleAction1.message}  ${i.consoleAction2.message}`
		};
		return consoleMessage;
	},
	actions: [
		i => i.consoleAction1, i => i.consoleAction2, i=> i.consoleAction3
	]
}

sendMessagesToConsole3.do();

type IEchoFileToConsoleAction = todo.IObjectGenerator<IEchoFile, iConsoleAct>;

interface IEchoFile extends iCompositeAct{
	readFileAction: todo.FileSystemActions.ITextFileReaderAction;
	showFileContentsInConsole: IEchoFileToConsoleAction;
	cacheFileContents: todo.IObjectGenerator<IEchoFile, todo.ICacheStringValueAction>;
	actions: todo.IObjectGenerator<IEchoFile, todo.IAction>[]
}

const readAndDisplayFile : IEchoFile = {
	do: todo.CompositeActionsImpl,
	readFileAction: {
		do: todo.FileSystemActions.textFileReaderActionImpl,
		relativeFilePath: `.git\\config`,
	},
	showFileContentsInConsole : i => {
		const consoleMessage: iConsoleAct = {
			do: todo.ConsoleLogActionImpl,
			message: i.readFileAction.state.content
		};
		return consoleMessage;
	},
	cacheFileContents : i => {
		const cacheAction: todo.ICacheStringValueAction = {
			do: todo.cacheStringValueActionImpl,
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

const context : todo.IContext = {};
	
readAndDisplayFile.do(context);
console.log(context.stringCache['someKey']);

interface IIncrementAction extends todo.IAction{
	currentVal?: number;
}

function IncrementActionImpl(){
	const thisAction: IIncrementAction = this;
	if(!thisAction.currentVal) thisAction.currentVal = 0;
	thisAction.currentVal++;
}

interface ICountToALimit extends todo.IRecurringAction{
	incrementAction: IIncrementAction;
	testForRepeat: (ctal: ICountToALimit) => boolean;
	actions: todo.IObjectGenerator<ICountToALimit, todo.IAction>[]	
}

const counter: ICountToALimit = {
	do: todo.RecurringActionImpl,
	incrementAction: {
		do: IncrementActionImpl,
		currentVal: 0,
	},
	testForRepeat: i => i.incrementAction.currentVal < 10,
	actions: [i => i.incrementAction],
}

counter.do();
console.log(counter.incrementAction.currentVal);

const incrementAction: IIncrementAction = {
	do: IncrementActionImpl,
	currentVal: 0,
}

const counter2 : todo.IRecurringAction = {
	do: todo.RecurringActionImpl,
	testForRepeat: i => incrementAction.currentVal < 20,
	actions: [incrementAction]
}

counter2.do();
console.log(incrementAction.currentVal);