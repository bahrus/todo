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
            message: "This is foo"
        },
        {
            do: ca.ConsoleActionImpl,
            message: "That is bar"
        },
        function (cA) { return cA.actions[0]; }
    ]
};
sendMessagesToConsole2.do();
var sendMessagesToConsole3 = {
    do: ca.CompositeActionsImpl,
    consoleAction1: {
        do: ca.ConsoleActionImpl,
        message: "To Err is human."
    },
    consoleAction2: {
        do: ca.ConsoleActionImpl,
        message: "To really foul things up requires a computer."
    },
    consoleAction3: function (i) {
        var consoleMessage = {
            do: ca.ConsoleActionImpl,
            message: i.consoleAction1.message + "  " + i.consoleAction2.message
        };
        return consoleMessage;
    },
    actions: [
        function (i) { return i.consoleAction1; }, function (i) { return i.consoleAction2; }, function (i) { return i.consoleAction3; }
    ]
};
sendMessagesToConsole3.do();
//# sourceMappingURL=app.js.map