///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>
///<reference path='FileSystemActions.ts'/>
if (typeof (global) !== 'undefined') {
    require('./CommonActions');
    require('./FileSystemActions');
    require('./NodeJSImplementations');
}
var ca = todo.CommonActions;
var fsa = todo.FileSystemActions;
var sendHelloWorldToConsole = {
    do: ca.ConsoleLogActionImpl,
    message: "hello, world"
};
sendHelloWorldToConsole.do();
var sendYouveGotMaileToConsole = {
    do: ca.ConsoleLogActionImpl,
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
            do: ca.ConsoleLogActionImpl,
            message: "This is foo"
        },
        {
            do: ca.ConsoleLogActionImpl,
            message: "That is bar"
        },
        function (cA) { return cA.actions[0]; }
    ]
};
sendMessagesToConsole2.do();
var sendMessagesToConsole3 = {
    do: ca.CompositeActionsImpl,
    consoleAction1: {
        do: ca.ConsoleLogActionImpl,
        message: "To Err is human."
    },
    consoleAction2: {
        do: ca.ConsoleLogActionImpl,
        message: "To really foul things up requires a computer."
    },
    consoleAction3: function (i) {
        var consoleMessage = {
            do: ca.ConsoleLogActionImpl,
            message: i.consoleAction1.message + "  " + i.consoleAction2.message
        };
        return consoleMessage;
    },
    actions: [
        function (i) { return i.consoleAction1; }, function (i) { return i.consoleAction2; }, function (i) { return i.consoleAction3; }
    ]
};
sendMessagesToConsole3.do();
var readAndDisplayFile = {
    do: ca.CompositeActionsImpl,
    readFileAction: {
        do: todo.FileSystemActions.textFileReaderActionImpl,
        relativeFilePath: ".git\\config",
    },
    showFileContentsInConsole: function (i) {
        var consoleMessage = {
            do: ca.ConsoleLogActionImpl,
            message: i.readFileAction.state.content
        };
        return consoleMessage;
    },
    actions: [
        function (i) { return i.readFileAction; },
        function (i) { return i.showFileContentsInConsole; },
    ]
};
var context = {};
readAndDisplayFile.do(context);
//const readFileAndLogContentsToConsole: 
//# sourceMappingURL=app.js.map