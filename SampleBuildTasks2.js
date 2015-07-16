///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='todo.ts'/>
///<reference path='FileSystemActions.ts'/>
if (typeof global !== 'undefined') {
    require('./todo');
    require('./FileSystemActions');
}
var sampleBuildTasks2;
(function (sampleBuildTasks2) {
    sampleBuildTasks2.replaceToDoPath = function (s) { return s.replace('todo', 'todox'); };
})(sampleBuildTasks2 || (sampleBuildTasks2 = {}));
var sampleBuildTasks2;
(function (sampleBuildTasks2_1) {
    var fsa = todo.FileSystemActions;
    var sampleBuildTasks2 = {
        do: todo.RecurringActionImpl,
        debug: true,
        testForRepeat: function (i) { return i.htmlFileSelector.filePathGenerator.hasNext; },
        htmlFileSelector: {
            do: fsa.HTMLFileSelectorActionImpl,
            fileTest: fsa.commonHelperFunctions.testForHtmlFileName,
        },
        domBuildDirectives: {
            removeBuildDirective: {
                do: todo.DOMActions.RemoveDOMElementActionImpl,
                domState: {},
                selector: {
                    cssSelector: 'todo-delete'
                }
            },
            // makeJSClobDirective: {
            //     do: DOMActions.DOMTransform,
            //     selector: {
            //         cssSelector: 'head>script[src]',
            //         do: DOMActions.selectElements,
            //         //debug: true,
            //     },
            //     elementAction: {
            //         do: DOMActions.addToJSClob,
            //     },
            // },
            actions: [
                function (i) {
                    i.removeBuildDirective.domState.htmlFile = i.domState.htmlFile;
                    return i.removeBuildDirective;
                },
            ]
        },
        htmlFileSaver: {
            filePathModifier: {
                do: sampleBuildTasks2_1.replaceToDoPath,
            }
        },
        initActions: [function (i) { return i.htmlFileSelector; }],
        repeatingActions: [
            function (i) { return i.htmlFileSelector.filePathGenerator; },
            function (i) {
                i.domBuildDirectives.domState = {
                    htmlFile: i.htmlFileSelector.htmlFileSelectorState,
                };
                return i.domBuildDirectives;
            },
            function (i) {
                i.htmlFileSaver.htmlFileSelectorState = i.htmlFileSelector.htmlFileSelectorState;
                return i.htmlFileSaver;
            }
        ],
    };
    var context = {};
    sampleBuildTasks2.do(context);
    console.log(sampleBuildTasks2.htmlFileSelector.filePathGenerator.selectedFilePaths);
})(sampleBuildTasks2 || (sampleBuildTasks2 = {}));
//# sourceMappingURL=SampleBuildTasks2.js.map