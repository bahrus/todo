var TSON;
(function (TSON) {
    var fnSignature = 'return ';
    var fnSignatureLn = fnSignature.length;
    var __name__ = '__name__';
    var __subs__ = '__subs__';
    Object.defineProperty(String.prototype, '$', {
        get: function () {
            return this;
        }
    });
    function labelObject(getter) {
        //debugger;
        var fnString = getModuleName(getter.toString());
        var obj = getter();
        labelObjectWithStr(obj, fnString);
    }
    TSON.labelObject = labelObject;
    function labelObjectWithStr(obj, label) {
        obj[__name__] = label;
        for (var key in obj) {
            var childObj = obj[key];
            var typ = typeof childObj;
            switch (typ) {
                case 'object':
                    var childLbl = label + '.' + key;
                    labelObjectWithStr(childObj, childLbl);
                    break;
            }
        }
    }
    function attachBindings(obj, rootObj, path) {
        if (!rootObj)
            rootObj = obj;
        if (!path)
            path = '';
        for (var key in obj) {
            var childObj = obj[key];
            var newPath = path ? path + '.' + key : key;
            var cn = childObj[__name__];
            if (cn) {
                if (!rootObj[__subs__])
                    rootObj[__subs__] = {};
                rootObj[__subs__][newPath] = cn;
            }
            var typ = typeof childObj;
            switch (typ) {
                case 'object':
                    attachBindings(childObj, rootObj, newPath);
                    break;
            }
        }
    }
    function stringify(getter, refs) {
        if (refs) {
            refs.forEach(function (ref) { return labelObject(ref); });
        }
        var fnString = getModuleName(getter.toString());
        var obj = getter();
        attachBindings(obj);
        obj[__name__] = fnString;
        return JSON.stringify(obj);
    }
    TSON.stringify = stringify;
    function getObjFromPath(startingObj, path, createIfNotFound, truncateNo) {
        if (!truncateNo)
            truncateNo = 0;
        var paths = path.split('.');
        var modulePath = startingObj;
        var n = paths.length;
        for (var i = 0; i < n - truncateNo; i++) {
            var word = paths[i];
            var newModulePath = modulePath[word];
            if (createIfNotFound) {
                if (!newModulePath) {
                    newModulePath = {};
                    modulePath[word] = newModulePath;
                }
            }
            else if (!newModulePath) {
                throw path + "not found.";
            }
            modulePath = newModulePath;
        }
        var returnObj = {
            obj: modulePath
        };
        if (truncateNo) {
            returnObj.nextWord = paths[n - truncateNo];
        }
        return returnObj;
    }
    function objectify(getter, tson) {
        var obj = JSON.parse(tson);
        var fnString = getModuleName(getter.toString());
        if (fnString.length === 0) {
            throw "No Destination path found";
        }
        if (obj[__name__] !== fnString) {
            throw "Destination path does not match signature of object";
        }
        //const paths = fnString.split('.');
        //let modulePath = window;
        //const lenMin1 = paths.length - 1;
        //for(let i = 0; i < lenMin1; i++){
        //    const path = paths[i];
        //    if(!modulePath[path]){
        //        modulePath[path] = {};
        //    }
        //    modulePath = modulePath[path];
        //}
        var moduleInfo = getObjFromPath(window, fnString, true, 1);
        moduleInfo.obj[moduleInfo.nextWord] = obj;
        var subs = obj[__subs__];
        if (subs) {
            for (var path in subs) {
                var pathInfo = getObjFromPath(obj, path, false, 1);
                var val = getObjFromPath(window, subs[path]);
                pathInfo.obj[pathInfo.nextWord] = val.obj;
            }
        }
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