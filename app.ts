///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>

declare var global;
if(typeof(global) !== 'undefined'){
    require('./CommonActions');
}

const ca = todo.CommonActions;

const sendHelloWorldToConsole: todo.CommonActions.IConsoleAction = {
	do: ca.ConsoleActionImpl,
	message: `hello, world`
}

sendHelloWorldToConsole.do();

const sendYouveGotMaileToConsole: todo.CommonActions.IConsoleAction = {
	do: ca.ConsoleActionImpl,
	message: `You've got mail`
}

const sendMessagesToConsole: todo.CommonActions.ICompositeActions = {
	do: ca.CompositeActionsImpl,
	actions: [sendHelloWorldToConsole, sendYouveGotMaileToConsole]
}

sendMessagesToConsole.do();

// interface IToDoList{
// 	sendMessageToConsole: todo.CommonActions.IConsoleAction;
// }

// const todoActions : IToDoList = {
// 	sendMessageToConsole: {
// 		do: ca.ConsoleActionImpl,
// 		message: 'hello, world'
// 	}
// };

