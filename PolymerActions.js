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
        var FixedFormData = FormData;
        function IXHRExtensionImpl(context, callback, action) {
            var polyEl = action.polymerElement;
            if (polyEl.tagName !== 'FORM')
                throw "Not allowed to add XHRExtension to " + polyEl.tagName + " element.";
            var frmEl = polyEl;
            frmEl.addEventListener('submit', function (ev) {
                //region handle submit event, turn it into ajax call
                ev.preventDefault();
                var request = new XMLHttpRequest();
                var action = frmEl.action;
                var method = frmEl.method;
                request.open(method, action);
                var frmData = new FixedFormData(frmEl);
                request.send(frmData);
                //endregion
            });
        }
        PolymerActions.IXHRExtensionImpl = IXHRExtensionImpl;
    })(PolymerActions = todo.PolymerActions || (todo.PolymerActions = {}));
})(todo || (todo = {}));
//# sourceMappingURL=PolymerActions.js.map