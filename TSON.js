var TSON;
(function (TSON) {
    var fnSignature = 'return ';
    var fnSignatureLn = fnSignature.length;
    var __name__ = '__name__';
    Object.defineProperty(String.prototype, '$', {
        get: function () {
            return this;
        }
    });
    function stringify(getter) {
        var fnString = getModuleName(getter.toString());
        var obj = getter();
        obj[__name__] = fnString;
        return JSON.stringify(obj);
    }
    TSON.stringify = stringify;
    function objectify(getter, tson) {
        var obj = JSON.parse(tson);
        var fnString = getModuleName(getter.toString());
        if (fnString.length === 0) {
            throw "No Destination path found";
        }
        if (obj[__name__] !== fnString) {
            throw "Destination path does not match signature of object";
        }
        var paths = fnString.split('.');
        var modulePath = window;
        var lenMin1 = paths.length - 1;
        for (var i = 0; i < lenMin1; i++) {
            var path = paths[i];
            if (!modulePath[path]) {
                modulePath[path] = {};
            }
            modulePath = modulePath[path];
        }
        modulePath[paths[lenMin1]] = obj;
        return obj;
    }
    TSON.objectify = objectify;
    function getModuleName(fnString) {
        var iPosReturn = fnString.indexOf(fnSignature);
        fnString = fnString.substr(iPosReturn + fnSignatureLn);
        var iPosSemi = fnString.indexOf(';');
        fnString = fnString.substr(0, iPosSemi);
        return fnString;
    }
})(TSON || (TSON = {}));
//# sourceMappingURL=TSON.js.map