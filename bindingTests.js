///<reference path='todo-bind.ts'/>
var bindingTests;
(function (bindingTests) {
    bindingTests.myModel = {
        name: 'Bruce',
        address: '',
        color: 'red'
    };
    bindingTests.spanExample = [
        {
            pull: function (e) { return bindingTests.myModel.name; },
            attr: '#text'
        },
        {
            pull: function (e) { return bindingTests.myModel.name; },
            attr: 'title'
        },
        {
            get: function (e) { return bindingTests.myModel.color; },
            attr: 'style'
        }
    ];
    bindingTests.divExample = { pull: function (e) { return bindingTests.myModel.address; } };
    bindingTests.inputGetExample = { get: function (e) { return bindingTests.myModel.name; } };
    bindingTests.inputSetExample = { set: function (e) { return bindingTests.myModel.address; } };
    bindingTests.inputPushExample = { push: function (e) { return bindingTests.myModel.address; } };
})(bindingTests || (bindingTests = {}));
//# sourceMappingURL=bindingTests.js.map