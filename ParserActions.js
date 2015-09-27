//'use strict';
///
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var tsp;
(function (tsp) {
    var ParserActions;
    (function (ParserActions) {
        var ca = tsp.CommonActions;
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
        var lineType;
        (function (lineType) {
            lineType[lineType["Empty"] = 0] = "Empty";
            lineType[lineType["BeginningComment"] = 1] = "BeginningComment";
            lineType[lineType["ContinuingComment"] = 2] = "ContinuingComment";
            lineType[lineType["EndingComment"] = 3] = "EndingComment";
            lineType[lineType["CodeAndSingleLineComment"] = 4] = "CodeAndSingleLineComment";
            lineType[lineType["SingleLineComment"] = 5] = "SingleLineComment";
            lineType[lineType["BeginningCommentAndRegionComment"] = 6] = "BeginningCommentAndRegionComment";
            lineType[lineType["EndingCommentAndEndRegionComment"] = 7] = "EndingCommentAndEndRegionComment";
            lineType[lineType["BeginningRegionComment"] = 8] = "BeginningRegionComment";
            lineType[lineType["EndRegionComment"] = 9] = "EndRegionComment";
            lineType[lineType["SingleLineStatement"] = 10] = "SingleLineStatement";
            lineType[lineType["BeginningBrace"] = 11] = "BeginningBrace";
            lineType[lineType["EndingBrace"] = 12] = "EndingBrace";
            lineType[lineType["BeginningBracket"] = 13] = "BeginningBracket";
            lineType[lineType["EndingBracket"] = 14] = "EndingBracket";
            lineType[lineType["BeginningStringTemplate"] = 15] = "BeginningStringTemplate";
            lineType[lineType["EndingStringTeplate"] = 16] = "EndingStringTeplate";
            lineType[lineType["BeginningParenthesis"] = 17] = "BeginningParenthesis";
            lineType[lineType["EndingParenthesis"] = 18] = "EndingParenthesis";
            lineType[lineType["BeginningParenthesisBrace"] = 19] = "BeginningParenthesisBrace";
            lineType[lineType["EndingParenthesisBrace"] = 20] = "EndingParenthesisBrace";
        })(lineType || (lineType = {}));
        ;
        var Statement = (function () {
            function Statement() {
            }
            return Statement;
        })();
        var OpenStatement = (function (_super) {
            __extends(OpenStatement, _super);
            function OpenStatement() {
                _super.apply(this, arguments);
            }
            return OpenStatement;
        })(Statement);
    })(ParserActions = tsp.ParserActions || (tsp.ParserActions = {}));
})(tsp || (tsp = {}));
try {
    global.refs.ref = ['ParserActions', tsp.ParserActions];
}
finally { }
//# sourceMappingURL=ParserActions.js.map