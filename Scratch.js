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
var myModule;
(function (myModule) {
    var whatever;
    (function (whatever) {
        whatever.test = 'hello';
    })(whatever = myModule.whatever || (myModule.whatever = {}));
})(myModule || (myModule = {}));
var testS = TSON.stringify(function () { return myModule.whatever; });
debugger;
delete myModule.whatever;
debugger;
var testO = TSON.objectify(function () { return myModule.whatever; }, testS);
debugger;
//# sourceMappingURL=Scratch.js.map