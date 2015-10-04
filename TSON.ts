module TSON{

    const fnSignature = 'return ';
    const fnSignatureLn = fnSignature.length;
    const __name__ = '__name__';
    const __subs__ = '__subs__';

    Object.defineProperty(String.prototype, '$', {
        get: function(){
            return this;
        }
    });

    export interface String{
        $: String;
    }

    export function labelObject(getter: () => Object){
        //debugger;
        const fnString = getModuleName ( getter.toString() );
        const obj = getter();
        labelObjectWithStr(obj, fnString);
    }

    function labelObjectWithStr(obj: Object, label: string){
        obj[__name__] = label;
        for(var key in obj){
            const childObj = obj[key];
            const typ = typeof childObj;
            switch(typ){
                case 'object':
                    const childLbl = label + '.' + key;
                    labelObjectWithStr(childObj, childLbl);
                    break;
            }
        }
    }

    function attachBindings(obj: Object, rootObj?: Object, path?: string){
        if(!rootObj) rootObj = obj;
        if(!path) path = '';
        for(let key in obj){
            const childObj = obj[key];
            const newPath = path ? path + '.' + key : key;
            const cn = childObj[__name__];
            if(cn){

                if(!rootObj[__subs__]) rootObj[__subs__] = {};
                rootObj[__subs__][newPath] = cn;
            }
            const typ = typeof childObj;
            switch(typ) {
                case 'object':
                    attachBindings(childObj, rootObj, newPath);
                    break;
            }
        }
    }

    export function stringify(getter: () => Object, refs?: [() => Object]){
        if(refs){
            refs.forEach(ref => labelObject(ref));
        }
        const fnString = getModuleName ( getter.toString() );
        const obj = getter();
        attachBindings(obj);
        obj[__name__] = fnString;
        return JSON.stringify(obj);
    }

    function getObjFromPath(startingObj: Object, path: string, createIfNotFound?: boolean, truncateNo?: number) : {obj: Object, nextWord?: string} {
        if(!truncateNo) truncateNo = 0;
        const paths = path.split('.');
        let modulePath = startingObj;
        let n = paths.length;
        for(let i = 0; i < n - truncateNo; i++){
            const word = paths[i];
            let newModulePath = modulePath[word];
            if(createIfNotFound){
                if(!newModulePath){
                    newModulePath = {};
                    modulePath[word] = newModulePath;

                }
            }else if(!newModulePath){
                throw path + "not found."
            }
            modulePath = newModulePath;
        }
        const returnObj : {obj: Object, nextWord?: string} = {
            obj: modulePath,
        }
        if(truncateNo){
            returnObj.nextWord = paths[n - truncateNo];
        }
        return returnObj;
    }

    export function objectify(getter: () => Object, tson: string){
        const obj = JSON.parse(tson);
        const fnString = getModuleName (  getter.toString() );
        if(fnString.length === 0){
            throw "No Destination path found";
        }
        if(obj[__name__] !== fnString){
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
        const moduleInfo = getObjFromPath(window, fnString, true, 1);
        moduleInfo.obj[moduleInfo.nextWord] = obj;
        const subs = obj[__subs__];
        if(subs){
            for(var path in subs){
                const pathInfo = getObjFromPath(obj, path, false, 1);
                const val = getObjFromPath(window, subs[path]);
                pathInfo.obj[pathInfo.nextWord] = val.obj;
            }
        }
        return obj;
    }

    function getModuleName(fnString: string) : string {
        const iPosReturn = fnString.indexOf(fnSignature);
        fnString = fnString.substr(iPosReturn + fnSignatureLn);
        const iPosSemi = fnString.indexOf(';');
        fnString = fnString.substr(0, iPosSemi);
        return fnString;
    }
}
