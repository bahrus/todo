///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path="todo.ts"/>
var todo;
(function (todo) {
    var PolymerActions;
    (function (PolymerActions) {
        function pushIntoModelArrayActionImpl(context, callback, action) {
            if (!action)
                action = this;
            var el = action.polymerElement;
            action.arrayRef.forEach(function (itm) { return el.push(action.pathToArray, itm); });
        }
        PolymerActions.pushIntoModelArrayActionImpl = pushIntoModelArrayActionImpl;
    })(PolymerActions = todo.PolymerActions || (todo.PolymerActions = {}));
})(todo || (todo = {}));
//# sourceMappingURL=PolymerElementActions.js.map