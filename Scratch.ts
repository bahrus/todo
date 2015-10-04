///<reference path="TSON.ts"/>

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

module myModule.whatever{
    export const test = 'hello'
}

const testS = TSON.stringify(() => myModule.whatever);
debugger;
delete myModule.whatever;
debugger;
const testO = TSON.objectify(() => myModule.whatever, testS);
debugger;