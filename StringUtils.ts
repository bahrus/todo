module todo.StringUtils{
	export function endsWith(str: string, suffix: string) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    export function startsWith(str: string, prefix: string) {
        return str.substr(0, prefix.length) === prefix;
    }

    export function replaceStartWith(str: string, prefix: string, replaceText: string) {
        if (!startsWith(str, prefix)) return str;
        return str.substr(prefix.length);
    }

    export function replaceEndWith(str: string, suffix: string, replaceText: string) {
        const iPosOfEnd = str.indexOf(suffix, str.length - suffix.length);
        if (iPosOfEnd === -1) return str;
        return str.substr(0, iPosOfEnd) + replaceText;
    }
}

(function(__global: any) {
    const modInfo = {
        name: 'todo',
        mod: todo,
        //subMod: todo.CommonActions,
    }
    if (typeof __global[modInfo.name] !== "undefined") {
        if (__global[modInfo.name] !== modInfo.mod) {
            for (var p in modInfo.mod) {
                __global[modInfo.name][p] = (<any>modInfo.mod)[p];
            }
        }
    }
    else {
        __global[modInfo.name] = modInfo.mod;
    }
})(
    typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());
