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
var sendMessagesToConsole2 = {
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
};
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
//# sourceMappingURL=app.js.map