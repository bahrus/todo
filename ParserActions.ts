//'use strict';
///

module tsp.ParserActions {
   
    const ca = tsp.CommonActions;
    //#region Helper functions
    


//#endregion

    interface ILineParserState extends CommonActions.IActionState {
        Lines: string[];
    }

    export interface ILineParser {
        textToParse?: string;
        state?: ILineParserState;
    }


    //http://benalman.com/news/2012/05/multiple-var-statements-javascript/
    //rules:  
    // 1)  parenthesis don't cross multiple lines
    // 2)  only one dangling brace per line, must be last live character (except comments).
    //interface ICurlyBraceParser {
    //    disallowParenthesisInCode?: boolean; // declarative syntax
    //    disallowNestedBraces?: boolean; //css
    //}

    //rules:  
    // 1) only one commented out #region, #endregion per line
    // 2) no comments before live code on the same line
    ////interface IStructure {

    ////}
    enum lineType {
        Empty,
        BeginningComment,
        ContinuingComment,
        EndingComment,
        CodeAndSingleLineComment,
        SingleLineComment,
        BeginningCommentAndRegionComment,
        EndingCommentAndEndRegionComment,
        BeginningRegionComment,
        EndRegionComment,
        SingleLineStatement,
        BeginningBrace,
        EndingBrace,
        BeginningBracket,
        EndingBracket,
        BeginningStringTemplate,
        EndingStringTeplate,
        BeginningParenthesis,
        EndingParenthesis,
        BeginningParenthesisBrace,
        EndingParenthesisBrace,
    };

    interface ITokenDelimiter {
        opener?: string;
        closer?: string;
        associatedLineType?: lineType;
    }

    interface ILightlyParsedLine {
        lineType: lineType;
        lineNumber: number;
        liveStatement?: string;
        commentText?: string;
    }

    interface ILineCategorizerState extends CommonActions.IActionState {
        lightlyParsedLines: ILightlyParsedLine[];
    }
    //Rules:  
    // 1)  quotes don't span multiple lines http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript
    export interface ILineCategorizer extends CommonActions.IAction {
        ignoreSingleLineComments?: boolean; //css
        lineParser?: ILineParser;
        state?: ILineCategorizerState;
        childDelimiters?: ITokenDelimiter[];
        forbiddenDelimiters?: ITokenDelimiter[];
        //maxOpenChildDelimiterPerLine?: number;

    }

    export interface IStatement {
        lineNo: number;
        parent: OpenStatement;
    }

    class Statement implements IStatement {
        lineNo: number;
        parent: IOpenStatement;
    }

    //class SingleLineStatement extends Statement { }

    export interface IOpenStatement extends IStatement {
        children: IStatement[];
        maxNoOfChildren: number;
    }

    class OpenStatement extends Statement {
        children: Statement[];
        maxNoOfChildren: number;
    }

    interface ILineNodifierState extends CommonActions.IActionState {
        rootNodes?: Statement[];
    }

    export interface ILineNodifier extends CommonActions.IAction {
        lineCategorizer?: ILineCategorizer;
        state?: ILineNodifierState;
    }


}

try {
    global.refs.ref = ['ParserActions', tsp.ParserActions];
} finally { }