///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path="todo.ts"/>
var todo;
(function (todo) {
    var Polymer;
    (function (Polymer) {
        function pushIntoModelArrayActionImpl(context, callback, action) {
            if (!action)
                action = this;
            var el = action.polymerElement;
            action.arrayRef.forEach(function (itm) { return el.push(action.pathToArray, itm); });
        }
        Polymer.pushIntoModelArrayActionImpl = pushIntoModelArrayActionImpl;
    })(Polymer = todo.Polymer || (todo.Polymer = {}));
})(todo || (todo = {}));
//# sourceMappingURL=PolymerElementActions.js.map