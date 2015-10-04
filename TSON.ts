module TSON{

    const fnSignature = 'return ';
    const fnSignatureLn = fnSignature.length;
    const __name__ = '__name__';

    Object.defineProperty(String.prototype, '$', {
        get: function(){
            return this;
        }
    });

    export function stringify(getter: () => Object){
        const fnString = getModuleName ( getter.toString() );
        const obj = getter();
        obj[__name__] = fnString;
        return JSON.stringify(obj);
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
        const paths = fnString.split('.');
        let modulePath = window;
        const lenMin1 = paths.length - 1;
        for(let i = 0; i < lenMin1; i++){
            const path = paths[i];
            if(!modulePath[path]){
                modulePath[path] = {};
            }
            modulePath = modulePath[path];
        }
        modulePath[paths[lenMin1]] = obj;
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
