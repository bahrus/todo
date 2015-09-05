///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path="todo.ts"/>
var todo;
(function (todo) {
    var PolymerActions;
    (function (PolymerActions) {
        function pushIntoModelArrayActionImpl(context, callback, action) {
            if (!action)
                action = this;
            var el = action.targetElement;
            action.arrayRef.forEach(function (itm) { return el.push(action.pathToArray, itm); });
        }
        PolymerActions.pushIntoModelArrayActionImpl = pushIntoModelArrayActionImpl;
        var FixedFormData = FormData; //Temporary until typescript 1.6
        function IStoreResultActionImpl(context, callback, action) {
            var result = action.resultMessage;
            var targetElements = [action.formElement];
            if (action.targetSelector) {
                throw "not implemented";
            }
            if (!action.targetPath) {
                throw "targetPath not specified.";
            }
            targetElements.forEach(function (targetElement) {
                targetElement[action.targetPath] = result;
            });
        }
        var lastTransaction = 'lastTransaction';
        function IXHRExtensionImpl(context, callback, action) {
            if (!action)
                action = this;
            var polyEl = action.targetElement;
            if (polyEl.tagName !== 'FORM')
                throw "Not allowed to add XHRExtension to " + polyEl.tagName + " element.";
            var frmEl = polyEl;
            //frmEl.addEventListener('submit', (ev:Event) => {
            frmEl.submit = function () {
                //region handle submit event, turn it into ajax call if passes validation
                //const ev = window.event;
                //ev.preventDefault();
                var frmData = new FixedFormData(frmEl); //Temporary until typescript 1.6
                if (action.validator) {
                    if (!action.validator(frmData))
                        return;
                }
                var request = new XMLHttpRequest();
                var frmAction = frmEl.action;
                var method = frmEl.method;
                var lt = lastTransaction;
                if (action.cacheLastTransaction) {
                    var lastTransaction_1 = frmEl[lt];
                    if (lastTransaction_1) {
                        if ((lastTransaction_1.frmAction === frmAction) && (lastTransaction_1.method === method)) {
                            if (deepCompare(lastTransaction_1.frmData, frmData)) {
                                //get from cache
                                if (action.reprocessEvenWhenCached) {
                                    processData(context, callback, action, lastTransaction_1.data);
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
                            frmEl[lastTransaction] = thisTransaction;
                        }
                        processData(context, callback, action, request.responseText);
                    }
                };
                request.send(frmData);
                //endregion
            };
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
                    subtree: true
                };
                mutObserver.observe(frmEl, mutObserverConfig);
                frmEl.submit();
            }
        }
        PolymerActions.IXHRExtensionImpl = IXHRExtensionImpl;
        function processData(context, callback, action, data) {
            //const frmEl = <HTMLFormElement> action.targetElement;
            if (action.successAction) {
                var sA = action.successAction;
                if (!sA.do) {
                    sA.do = IStoreResultActionImpl;
                }
                sA.resultMessage = data;
                sA.formElement = action.targetElement;
                sA.do(context, callback, sA);
                delete sA.resultMessage;
                delete sA.formElement;
            }
        }
        //endregion
        function deepCompare(lhs, rhs) {
            return JSON.stringify(lhs) === JSON.stringify(rhs);
        }
        var HashBinding = (function () {
            function HashBinding() {
                this.currentValues = {};
                //region listen for hash address changes
                window.addEventListener("hashchange", this.handleHashChange, false);
                //endregion
            }
            HashBinding.prototype.handleHashChange = function () {
            };
            HashBinding.prototype.commit = function () {
            };
            HashBinding.prototype.parseHash = function () {
            };
            return HashBinding;
        })();
    })(PolymerActions = todo.PolymerActions || (todo.PolymerActions = {}));
})(todo || (todo = {}));
//# sourceMappingURL=PolymerActions.js.map