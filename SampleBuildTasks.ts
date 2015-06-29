﻿
module SampleBuildTasks {
    try {
        require('./Refs');
        global.refs.moduleTarget = tsp;
    } finally { }
    const ca = tsp.CommonActions;
    const fsa = tsp.FileSystemActions;
    const da = tsp.DOMActions;
    const dbd = tsp.DOMBuildDirectives;

    export interface IProgramConfig extends CommonActions.ITypedActionList<IProgramConfig> {
        cacheVersionLabel?: FileSystemActions.ICacheFileContents;
        minifyJSFiles?: FileSystemActions.ISelectAndProcessFileAction;
        selectAndReadHTMLFiles?: FileSystemActions.ISelectAndReadHTMLFilesAction;
        waitForUserInput?: FileSystemActions.IWaitForUserInput;
        domBuildDirectives?: DOMBuildDirectives.IDOMBuildDirectives;
        domProcessor?: DOMActions.IDOMTransformForEachHTMLFileAction<IProgramConfig, FileSystemActions.IHTMLFile>;
        exportInMemoryDocumentsToFiles?: FileSystemActions.IExportDocumentsToFiles;

    }

    const versionKey = 'version';
    
    
    export const programConfig: IProgramConfig = {
        do: ca.doSubActions,
        subActionsGenerator: [
            i =>  i.cacheVersionLabel,
            i => i.minifyJSFiles,
            i => i.selectAndReadHTMLFiles,
            i => {
                i.domProcessor.htmlFiles = i.selectAndReadHTMLFiles.fileProcessor.state.HTMLFiles;
                i.domProcessor.domTransforms = [i.domBuildDirectives.removeBuildDirective, i.domBuildDirectives.makeJSClobDirective];
                return i.domProcessor;
            },
            //i => i.domProcessor,
            i => i.exportInMemoryDocumentsToFiles,
            i => i.waitForUserInput
        ],
        cacheVersionLabel: {
            do: fsa.cacheTextFile,
            fileReaderAction: {
                do: fsa.readTextFile,
                rootDirectoryRetriever: fsa.commonHelperFunctions.retrieveWorkingDirectory,
                relativeFilePath: 'Version.txt',
            },
            cacheKey: versionKey
        },
        minifyJSFiles: {
            //#region minify JS Files
            do: fsa.selectAndProcessFiles,
            fileSelector: {
                do: fsa.selectFiles,
                fileTest: fsa.commonHelperFunctions.testForNonMinifiedJSFileName,
                rootDirectoryRetriever: fsa.commonHelperFunctions.retrieveWorkingDirectory,
            },
            fileProcessor: {
                do: fsa.minifyJSFile,
                async: true,
            },
            async: true,
            //#endregion
        },
        selectAndReadHTMLFiles: {
            do: fsa.selectAndProcessFiles,
            //debug: true,
            fileSelector: {
                do: fsa.selectFiles,
                fileTest: fsa.commonHelperFunctions.testForHtmlFileName,
                rootDirectoryRetriever: fsa.commonHelperFunctions.retrieveWorkingDirectory,
            },
            fileProcessor: {
                do: fsa.storeHTMLFiles,
                //debug: true,
            },
        },
        domBuildDirectives: dbd.domBuildConfig,

        domProcessor: {
            do: da.ApplyDOMTransformsOnHTMLFiles,
        },
        exportInMemoryDocumentsToFiles: {
            do: fsa.exportProcessedDocumentsToFiles,
            outputRootDirectoryPath: 'OutputTest',
        },
        waitForUserInput: {
            do: fsa.waitForUserInput,
        },
        


        async: true,
    };

}

try {
    global.refs.ref = ['BuildConfig', tsp.BuildConfig];
} finally { }
