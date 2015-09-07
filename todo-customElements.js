///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>
var todo;
(function (todo) {
    var customElements;
    (function (customElements) {
        function nextNonScriptSibling(el) {
            var nextElement = el.nextElementSibling;
            while (nextElement && nextElement.tagName === 'SCRIPT') {
                nextElement = nextElement.nextElementSibling;
            }
            return nextElement;
        }
        var initExtension = {
            is: 'todo-init',
            extends: 'script',
            properties: {
                allowedTargets: {
                    type: String
                }
            },
            attached: function () {
                var that = eval('this'); //mystery why this is necessary
                //const thisEl = <HTMLElement> that;
                //console.log(thisEl.parentNode);
                window.addEventListener('load', function (ev) {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var action = eval(inner);
                        action.targetElement = target;
                        action.do(null, null, action);
                    }
                });
            }
        };
        var todoInitScript = Polymer(initExtension);
        var loadFileFn = 'loadFile';
        //<link is="todo-include" href="HTML1.html"/>
        var includeExtension = (_a = {
                is: 'todo-include',
                extends: 'link',
                //from http://stackoverflow.com/questions/31053947/dynamically-load-html-page-using-polymer-importhref
                properties: {
                    href: {
                        type: String,
                        observer: loadFileFn
                    }
                }
            },
            _a[loadFileFn] = function (path) {
                var that = eval('this'); //mystery why this is necessary
                if (that.href) {
                    var link = that.importHref(that.href, function () {
                        that.async(function () {
                            that.style.display = 'inline-block';
                            Polymer.dom(that).appendChild(link.import.body.firstChild);
                        }, 1);
                    }, function () {
                        console.log("error");
                    });
                }
            },
            _a
        );
        var includeScript = Polymer(includeExtension);
        var attrExtension = {
            is: 'todo-attr',
            extends: 'script',
            attached: function () {
                var that = eval('this'); //mystery why this is necessary
                window.addEventListener('load', function (ev) {
                    var target = nextNonScriptSibling(that);
                    if (target) {
                        var inner = that.innerText;
                        var attributes = eval(inner);
                        for (var i = 0, n = attributes.length; i < n; i++) {
                            var attributePart = attributes[i];
                            for (var key in attributePart) {
                                //Polymer.dom(target).setAttribute(key,  attributePart[key]);
                                if (key.indexOf('on-') === 0) {
                                    var eventName = key.substring(3);
                                    that.domHost.listen(target, eventName, attributePart[key]);
                                }
                                else {
                                    Polymer.dom(target).setAttribute(key, attributePart[key]); //untested code
                                }
                            }
                        }
                    }
                });
            }
        };
        var attrScript = Polymer(attrExtension);
        var maxValue = 'maxValue';
        var pixelHeight = 'pixelHeight';
        var pixelWidth = 'pixelWidth';
        var calculateStyles = 'calculateStyles';
        var outerStyle = 'outerStyle';
        var innerStyle = 'innerStyle';
        var getScrollbarWidth = 'getScrollbarWidth';
        var handleScrollEvent = 'handleScrollEvent';
        var maxVerticalElementsInViewPane = 'maxVerticalElementsInViewPane';
        var oldVal = 'oldVal';
        var oldScrollDimVal = 'oldScrollDimVal';
        function getScrollDim(dimension) {
            var outer = document.createElement("div");
            outer.style.visibility = "hidden";
            switch (dimension) {
                case 'Height':
                    outer.style.height = "100px";
                    break;
                case 'Width':
                    outer.style.width = "100px";
                    break;
            }
            outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
            document.body.appendChild(outer);
            var offDim = 'offset' + dimension;
            var dimNoScroll = outer[offDim];
            // force scrollbars
            outer.style.overflow = "scroll";
            // add innerdiv
            var inner = document.createElement("div");
            inner.style[dimension.toLowerCase()] = "100%";
            outer.appendChild(inner);
            var dimWithScroll = inner[offDim];
            // remove divs
            outer.parentNode.removeChild(outer);
            return dimNoScroll - dimWithScroll;
        }
        function handleScrollEventForDim(e, scrollEl, direction) {
            var scrollDim;
            var pixelDim;
            switch (direction) {
                case 'v':
                    scrollDim = 'scrollTop';
                    pixelDim = pixelHeight;
                    break;
                case 'h':
                    scrollDim = 'scrollLeft';
                    pixelDim = pixelWidth;
                    break;
            }
            var srcElement = e.srcElement;
            var scrollDimVal = srcElement[scrollDim];
            console.log(scrollDimVal);
            var newVal = Math.ceil((scrollDimVal - 1) / scrollEl[pixelDim]);
            var thisOldVal = scrollEl[oldVal];
            if (newVal === thisOldVal) {
                var thisOldScrollDimVal = scrollEl[oldScrollDimVal];
                if (scrollDimVal != thisOldScrollDimVal) {
                    srcElement[scrollDim] = srcElement[scrollDim] + (scrollDimVal - thisOldScrollDimVal);
                    return;
                }
            }
            var eventDetail = {
                originalEvent: e,
                oldValue: thisOldVal,
                newValue: newVal
            };
            //debugger;
            //Polymer.dom(this.root).setAttribute('value', newVal.toString());
            var _thisDomapi = scrollEl;
            _thisDomapi.setAttribute('value', newVal.toString());
            scrollEl.fire('scroll', eventDetail);
            scrollEl[oldVal] = newVal;
            scrollEl[oldScrollDimVal] = scrollDimVal;
        }
        var vScrollControl = (_b = {
                is: 'todo-vscroll',
                properties: (_c = {},
                    _c[maxValue] = {
                        type: Number,
                        value: 1000
                    },
                    _c[pixelHeight] = {
                        type: Number,
                        value: 291
                    },
                    _c[maxVerticalElementsInViewPane] = {
                        type: Number,
                        value: 10
                    },
                    _c
                ),
                ready: function () {
                    this[calculateStyles]();
                }
            },
            _b[calculateStyles] = function () {
                this[outerStyle] = "height:" + this[pixelHeight] + "px;width:" + getScrollDim('Width') + "px;background-color:red;overflow-y:auto;display:inline-block";
                var innerHeight = (this[maxValue] - this[maxVerticalElementsInViewPane]) * this[pixelHeight];
                //const innerHeight = this[maxValue];
                this[innerStyle] = "height:" + innerHeight + "px; background-color:green";
            },
            _b[handleScrollEvent] = function (e) {
                handleScrollEventForDim(e, this, 'v');
            },
            _b
        );
        var vScrollScript = Polymer(vScrollControl);
        var hScrollControl = (_d = {
                is: 'todo-hscroll',
                properties: (_e = {},
                    _e[maxValue] = {
                        type: Number,
                        value: 100
                    },
                    _e[pixelWidth] = {
                        type: Number,
                        value: 317
                    },
                    _e
                ),
                ready: function () {
                    this[calculateStyles]();
                }
            },
            _d[calculateStyles] = function () {
                this[outerStyle] = "width:" + this[pixelWidth] + "px;height:" + getScrollDim('Height') + "px;background-color:red;overflow-x:auto;display:inline-block";
                var innerWidth = this[maxValue] * this[pixelWidth];
                this[innerStyle] = "width:" + innerWidth + "px; background-color:green";
            },
            _d[handleScrollEvent] = function (e) {
                debugger;
                handleScrollEventForDim(e, this, 'h');
            },
            _d
        );
        var hScrollScript = Polymer(hScrollControl);
        var _a, _b, _c, _d, _e;
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-customElements.js.map