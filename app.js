///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>
if (typeof (global) !== 'undefined') {
    require('./todo');
    require('./FileSystemActions');
}
//const ca = todo.CommonActions;
var fsa = todo.FileSystemActions;
var sendHelloWorldToConsole = {
    do: todo.ConsoleLogActionImpl,
    message: "hello, world"
};
sendHelloWorldToConsole.do();
var sendYouveGotMaileToConsole = {
    do: todo.ConsoleLogActionImpl,
    message: "You've got mail"
};
var sendMessagesToConsole = {
    do: todo.CompositeActionsImpl,
    actions: [sendHelloWorldToConsole, sendYouveGotMaileToConsole]
};
sendMessagesToConsole.do();
var sendMessagesToConsole2 = {
    do: todo.CompositeActionsImpl,
    actions: [
        {
            do: todo.ConsoleLogActionImpl,
            message: "This is foo"
        },
        {
            do: todo.ConsoleLogActionImpl,
            message: "That is bar"
        },
        function (cA) { return cA.actions[0]; }
    ]
};
sendMessagesToConsole2.do();
var sendMessagesToConsole3 = {
    do: todo.CompositeActionsImpl,
    consoleAction1: {
        do: todo.ConsoleLogActionImpl,
        message: "To Err is human."
    },
    consoleAction2: {
        do: todo.ConsoleLogActionImpl,
        message: "To really foul things up requires a computer."
    },
    consoleAction3: function (i) {
        var consoleMessage = {
            do: todo.ConsoleLogActionImpl,
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
    do: todo.CompositeActionsImpl,
    readFileAction: {
        do: todo.FileSystemActions.textFileReaderActionImpl,
        relativeFilePath: ".git\\config",
    },
    showFileContentsInConsole: function (i) {
        var consoleMessage = {
            do: todo.ConsoleLogActionImpl,
            message: i.readFileAction.domState.content
        };
        return consoleMessage;
    },
    cacheFileContents: function (i) {
        var cacheAction = {
            do: todo.cacheStringValueActionImpl,
            cacheKey: 'someKey',
            cacheValue: i.readFileAction.domState.content,
        };
        return cacheAction;
    },
    actions: [
        function (i) { return i.readFileAction; },
        //i => i.showFileContentsInConsole,
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
    do: todo.RecurringActionImpl,
    incrementAction: {
        do: IncrementActionImpl,
        currentVal: 0,
    },
    testForRepeat: function (i) { return i.incrementAction.currentVal < 10; },
    repeatingActions: [function (i) { return i.incrementAction; }],
};
counter.do();
console.log(counter.incrementAction.currentVal);
var incrementAction = {
    do: IncrementActionImpl,
    currentVal: 0,
};
var counter2 = {
    do: todo.RecurringActionImpl,
    testForRepeat: function (i) { return incrementAction.currentVal < 20; },
    repeatingActions: [incrementAction]
};
counter2.do();
console.log(incrementAction.currentVal);
//# sourceMappingURL=app.js.map