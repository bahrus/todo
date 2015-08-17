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
        var FixedFormData = FormData; //Temporary until typescript 1.6
        function deepCompare(lhs, rhs) {
            for (var key in lhs) {
                if (lhs[key] !== rhs[key]) {
                    return false;
                }
            }
            for (var key in rhs) {
                if (rhs[key] !== lhs[key]) {
                    return false;
                }
            }
            return true;
        }
        function processData(context, callback, action, data) {
        }
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
                var frmData = new FixedFormData(frmEl); //Temporary until typescript 1.6
                if (action.validator) {
                    if (!action.validator(frmData))
                        return;
                }
                var request = new XMLHttpRequest();
                var frmAction = frmEl.action;
                var method = frmEl.method;
                if (action.cacheLastTransaction) {
                    var lastTransaction = frmEl.get['lastTransaction'];
                    if (lastTransaction) {
                        if ((lastTransaction.frmAction === frmAction) && (lastTransaction.method === method)) {
                            if (deepCompare(lastTransaction.frmData, frmData)) {
                                //get from cache
                                if (action.reprocessEvenWhenCached) {
                                    processData(context, callback, action, lastTransaction.data);
                                }
                                return;
                            }
                        }
                    }
                }
                var url = frmAction;
                if (action.addTimestampToPreventServerSideCaching) {
                    if (url.indexOf('?') > -1) {
                        url += '&';
                    }
                    else {
                        url += '?';
                    }
                    url += 'todo_ts=' + (new Date()).getTime();
                }
                request.open(method, url);
                request.onreadystatechange = function (sc) {
                    if (request.readyState === 4) {
                        if (action.cacheLastTransaction) {
                            var thisTransaction = {
                                frmAction: frmAction,
                                method: method,
                                frmData: frmData,
                                data: request.responseText
                            };
                            frm[''];
                        }
                    }
                };
                request.send(frmData);
                //endregion
            });
            if (action.autoSubmit) {
                var mutObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        console.log(mutation);
                        frmEl.submit();
                    });
                });
                var mutObserverConfig = {
                    childList: true,
                    attributes: true,
                    subtree: true,
                };
                mutObserver.observe(frmEl, mutObserverConfig);
                frmEl.submit();
            }
        }
        PolymerActions.IXHRExtensionImpl = IXHRExtensionImpl;
    })(PolymerActions = todo.PolymerActions || (todo.PolymerActions = {}));
})(todo || (todo = {}));
//# sourceMappingURL=PolymerActions.js.map