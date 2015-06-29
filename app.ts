///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>

declare var global;
if(typeof(global) !== 'undefined'){
    require('./CommonActions');
}

const ca = todo.CommonActions;
type ica = todo.CommonActions.IConsoleAction

const sendHelloWorldToConsole: ica  = {
	do: ca.ConsoleActionImpl,
	message: `hello, world`
}

sendHelloWorldToConsole.do();

const sendYouveGotMaileToConsole: ica = {
	do: ca.ConsoleActionImpl,
	message: `You've got mail`
}

const sendMessagesToConsole: todo.CommonActions.ICompositeActions = {
	do: ca.CompositeActionsImpl,
	actions: [sendHelloWorldToConsole, sendYouveGotMaileToConsole]
}

sendMessagesToConsole.do();

interface IToDoList1 extends todo.CommonActions.ICompositeActions {
	actions: [ica, ica]
}

const sendMessagesToConsole2 : IToDoList1 = {
	do: ca.CompositeActionsImpl,
	actions: [
		{
			do: ca.ConsoleActionImpl,
			message: 'This is foo'
		},
		{
			do: ca.ConsoleActionImpl,
			message: 'That is bar'
		}
	]
}

sendMessagesToConsole2.do();

// interface IToDoList{
// 	sendMessageToConsole: todo.CommonActions.IConsoleAction;
// }

// const todoActions : IToDoList = {
// 	sendMessageToConsole: {
// 		do: ca.ConsoleActionImpl,
// 		message: 'hello, world'
// 	}
// };

