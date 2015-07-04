///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='CommonActions.ts'/>
///<reference path='FileSystemActions.ts'/>
if (typeof (global) !== 'undefined') {
    require('./CommonActions');
    require('./FileSystemActions');
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
    cacheFileContents: function (i) {
        var cacheAction = {
            do: ca.cacheStringValueActionImpl,
            cacheKey: 'someKey',
            cacheValue: i.readFileAction.state.content,
        };
        return cacheAction;
    },
    actions: [
        function (i) { return i.readFileAction; },
        //i => i.showFileContentsInConsole,
        function (i) { return i.cacheFileContents; },
    ]
};
var context = {};
readAndDisplayFile.do(context);
console.log(context.stringCache['someKey']);
function IncrementActionImpl() {
    var thisAction = this;
    if (!thisAction.currentVal)
        thisAction.currentVal = 0;
    thisAction.currentVal++;
}
var counter = {
    do: ca.RecurringActionImpl,
    incrementAction: {
        do: IncrementActionImpl,
        currentVal: 0,
    },
    testForRepeat: function (i) { return i.incrementAction.currentVal < 10; },
    actions: [function (i) { return i.incrementAction; }],
};
counter.do();
console.log(counter.incrementAction.currentVal);
//# sourceMappingURL=app.js.map