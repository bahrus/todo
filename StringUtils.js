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
(function (__global) {
    var modInfo = {
        name: 'todo',
        mod: todo,
    };
    if (typeof __global[modInfo.name] !== "undefined") {
        if (__global[modInfo.name] !== modInfo.mod) {
            for (var p in modInfo.mod) {
                __global[modInfo.name][p] = modInfo.mod[p];
            }
        }
    }
    else {
        __global[modInfo.name] = modInfo.mod;
    }
})(typeof window !== "undefined" ? window :
    typeof WorkerGlobalScope !== "undefined" ? self :
        typeof global !== "undefined" ? global :
            Function("return this;")());
//# sourceMappingURL=StringUtils.js.map