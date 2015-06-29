var todo;
(function (todo) {
    var StringUtils;
    (function (StringUtils) {
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        StringUtils.endsWith = endsWith;
        function startsWith(str, prefix) {
            return str.substr(0, prefix.length) === prefix;
        }
        StringUtils.startsWith = startsWith;
        function replaceStartWith(str, prefix, replaceText) {
            if (!startsWith(str, prefix))
                return str;
            return str.substr(prefix.length);
        }
        StringUtils.replaceStartWith = replaceStartWith;
        function replaceEndWith(str, suffix, replaceText) {
            var iPosOfEnd = str.indexOf(suffix, str.length - suffix.length);
            if (iPosOfEnd === -1)
                return str;
            return str.substr(0, iPosOfEnd) + replaceText;
        }
        StringUtils.replaceEndWith = replaceEndWith;
    })(StringUtils = todo.StringUtils || (todo.StringUtils = {}));
})(todo || (todo = {}));
//# sourceMappingURL=StringUtils.js.map