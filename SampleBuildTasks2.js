///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>
if (typeof global !== 'undefined') {
    require('./todo');
    require('./FileSystemActions');
}
var sampleBuildTasks2;
(function (sampleBuildTasks2_1) {
    var fsa = todo.FileSystemActions;
    var sampleBuildTasks2 = {
        do: todo.RecurringActionImpl,
        debug: true,
        testForRepeat: function (i) { return i.htmlFileSelector.state.hasNext; },
        htmlFileSelector: {
            do: todo.FileSystemActions.FileSelectorActionImpl,
            fileTest: fsa.commonHelperFunctions.testForHtmlFileName,
        },
        headActions: [function (i) { return i.htmlFileSelector; }],
        actions: [function (i) { return i.htmlFileSelector.state; }],
    };
    var context = {};
    sampleBuildTasks2.do(context);
    console.log(sampleBuildTasks2.htmlFileSelector.state.selectedFilePaths);
})(sampleBuildTasks2 || (sampleBuildTasks2 = {}));
//# sourceMappingURL=SampleBuildTasks2.js.map