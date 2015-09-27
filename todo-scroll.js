///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>
var todo;
(function (todo) {
    var customElements;
    (function (customElements) {
        var maxValue = 'maxValue';
        var pixelHeight = 'pixelHeight';
        var pixelWidth = 'pixelWidth';
        var calculateStyles = 'calculateStyles';
        var outerStyle = 'outerStyle';
        var innerStyle = 'innerStyle';
        var getScrollbarWidth = 'getScrollbarWidth';
        var handleScrollEvent = 'handleScrollEvent';
        var maxDimElementsInViewPane = 'maxDimElementsInViewPane';
        var mouseWheelCssSelector = 'mouseWheelCssSelector';
        var oldVal = 'oldVal';
        var oldScrollDimVal = 'oldScrollDimVal';
        function getScrollDim(dimension) {
            var scrollDiv = document.createElement("div");
            scrollDiv.className = "scrollbar-measure";
            document.body.appendChild(scrollDiv);
            // Get the scrollbar width
            var scrollbarWidth = scrollDiv['offset' + dimension] - scrollDiv['client' + dimension];
            document.body.removeChild(scrollDiv);
            if (scrollbarWidth === 0)
                scrollbarWidth = 17;
            return scrollbarWidth;
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
            //const srcElement = e.target;
            var srcElement = e.target || e.srcElement;
            var scrollDimVal = srcElement[scrollDim];
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
        var vScrollControl = (_a = {
                is: 'todo-vscroll',
                properties: (_b = {},
                    _b[maxValue] = {
                        type: Number,
                        value: 1000
                    },
                    _b[pixelHeight] = {
                        type: Number,
                        value: 291
                    },
                    _b[maxDimElementsInViewPane] = {
                        type: Number,
                        value: 10
                    },
                    _b[mouseWheelCssSelector] = {
                        type: String
                    },
                    _b
                ),
                ready: function () {
                    this[calculateStyles]();
                }
            },
            _a[calculateStyles] = function () {
                this[outerStyle] = "height:" + this[pixelHeight] + "px;width:" + getScrollDim('Width') + "px;background-color:red;overflow-y:auto;display:inline-block";
                var innerHeight = (this[maxValue] - this[maxDimElementsInViewPane]) * this[pixelHeight];
                //const innerHeight = this[maxValue];
                this[innerStyle] = "height:" + innerHeight + "px; background-color:green";
            },
            _a[handleScrollEvent] = function (e) {
                handleScrollEventForDim(e, this, 'v');
            },
            _a
        );
        var vScrollScript = Polymer(vScrollControl);
        var hScrollControl = (_c = {
                is: 'todo-hscroll',
                properties: (_d = {},
                    _d[maxValue] = {
                        type: Number,
                        value: 100
                    },
                    _d[pixelWidth] = {
                        type: Number,
                        value: 317
                    },
                    _d[maxDimElementsInViewPane] = {
                        type: Number,
                        value: 10
                    },
                    _d
                ),
                ready: function () {
                    this[calculateStyles]();
                }
            },
            _c[calculateStyles] = function () {
                this[outerStyle] = "width:" + this[pixelWidth] + "px;height:" + getScrollDim('Height') + "px;background-color:red;overflow-x:auto;display:inline-block";
                var innerWidth = (this[maxValue] - this[maxDimElementsInViewPane]) * this[pixelWidth];
                this[innerStyle] = "width:" + innerWidth + "px; background-color:green";
            },
            _c[handleScrollEvent] = function (e) {
                handleScrollEventForDim(e, this, 'h');
            },
            _c
        );
        var hScrollScript = Polymer(hScrollControl);
        var _a, _b, _c, _d;
    })(customElements = todo.customElements || (todo.customElements = {}));
})(todo || (todo = {}));
//# sourceMappingURL=todo-scroll.js.map