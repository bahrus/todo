///<reference path="TSON.ts"/>
var test = {
    s: 'string',
    f: function (a) { return 'hello'; },
    g: function (a) {
        return 'goodbye';
    }
};
test['__fs'] = test.f.toString();
test['__gs'] = test.g.toString();
console.log(JSON.stringify(test));
var myReferencedModule;
(function (myReferencedModule) {
    var something;
    (function (something) {
        something.myString = 'test'.$;
    })(something = myReferencedModule.something || (myReferencedModule.something = {}));
})(myReferencedModule || (myReferencedModule = {}));
var myModule;
(function (myModule) {
    var whatever;
    (function (whatever) {
        whatever.test = 'hello';
        whatever.test2 = myReferencedModule.something.myString;
    })(whatever = myModule.whatever || (myModule.whatever = {}));
})(myModule || (myModule = {}));
//TSON.labelObject(() => myReferencedModule.something);
var testS = TSON.stringify(function () { return myModule.whatever; }, [function () { return myReferencedModule; }]);
debugger;
delete myModule.whatever;
debugger;
var testO = TSON.objectify(function () { return myModule.whatever; }, testS);
debugger;
//# sourceMappingURL=Scratch.js.map