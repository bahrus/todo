///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>
if (typeof (global) !== 'undefined') {
    require('./CommonActions');
}
var ca = todo.CommonActions;
var sendHelloWorldToConsole = {
    do: ca.ConsoleActionImpl,
    message: "hello, world"
};
sendHelloWorldToConsole.do();
var sendYouveGotMaileToConsole = {
    do: ca.ConsoleActionImpl,
    message: "You've got mail"
};
var sendMessagesToConsole = {
    do: ca.CompositeActionsImpl,
    actions: [sendHelloWorldToConsole, sendYouveGotMaileToConsole]
};
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
//# sourceMappingURL=app.js.map