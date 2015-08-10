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
            if (!action)
                action = this;
            var polyEl = action.polymerElement;
            if (polyEl.tagName !== 'FORM')
                throw "Not allowed to add XHRExtension to " + polyEl.tagName + " element.";
            var frmEl = polyEl;
            frmEl.addEventListener('submit', function (ev) {
                //region handle submit event, turn it into ajax call if passes validation
                ev.preventDefault();
                var frmData = new FixedFormData(frmEl);
                if (action.validator) {
                    if (!action.validator(frmData))
                        return;
                }
                var request = new XMLHttpRequest();
                var frmAction = frmEl.action;
                var method = frmEl.method;
                request.open(method, frmAction);
                request.send(frmData);
                //endregion
            });
            var mutObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    console.log(mutation);
                });
                if (action.autoSubmit) {
                    frmEl.submit();
                }
            });
            var mutObserverConfig = {
                childList: true,
                attributes: true,
                subtree: true,
            };
            mutObserver.observe(frmEl, mutObserverConfig);
        }
        PolymerActions.IXHRExtensionImpl = IXHRExtensionImpl;
    })(PolymerActions = todo.PolymerActions || (todo.PolymerActions = {}));
})(todo || (todo = {}));
//# sourceMappingURL=PolymerActions.js.map