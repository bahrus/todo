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
var readAndDisplayFile = {
    do: ca.CompositeActionsImpl,
    readFileAction: {
        do: todo.FileSystemActions.textFileReaderActionImpl,
        relativeFilePath: "Scripts\\typings\\node\\node.d.ts",
    },
    showFileContentsInConsole: function (i) {
        var consoleMessage = {
            do: ca.ConsoleActionImpl,
            message: i.readFileAction.state.content
        };
        return consoleMessage;
    },
    actions: [
        function (i) { return i.readFileAction; },
        function (i) { return i.showFileContentsInConsole; },
    ]
};
var context = {
    HTMLOutputs: {},
    JSOutputs: {},
    stringCache: {},
    fileManager: new todo.NodeJSImplementations.NodeJSWebFileManager(),
};
readAndDisplayFile.do(context);
//const readFileAndLogContentsToConsole: 
//# sourceMappingURL=app.js.map