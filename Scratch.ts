///<reference path="TSON.ts"/>

interface String{
    $: String;
}

var test = {
    s: 'string',
    f: a => 'hello',
    g: function(a) {
        return 'goodbye'
    }
};
test['__fs'] = test.f.toString();
test['__gs'] = test.g.toString();

console.log(JSON.stringify(test));

module myReferencedModule.something{
    export const myString = 'test'.$;
    export function addOne(num: number){
        return num + 1;
    }
}

module myModule.whatever{
    export const test = 'hello';
    export const test2 = myReferencedModule.something.myString;
    export const test3 = myReferencedModule.something.addOne;
}


//TSON.labelObject(() => myReferencedModule.something);

const testS = TSON.stringify(() => myModule.whatever, [() => myReferencedModule]);
debugger;
delete myModule.whatever;
debugger;
const testO = TSON.objectify(() => myModule.whatever, testS);
debugger;