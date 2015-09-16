///<reference path='Scripts/typings/polymer/polymer.d.ts'/>
///<reference path='PolymerActions.ts'/>

module todo.customElements {

    const maxValue = 'maxValue';
    const pixelHeight = 'pixelHeight';
    const pixelWidth = 'pixelWidth';
    const calculateStyles = 'calculateStyles';
    const outerStyle = 'outerStyle';
    const innerStyle = 'innerStyle';
    const getScrollbarWidth = 'getScrollbarWidth';
    const handleScrollEvent = 'handleScrollEvent';
    const maxDimElementsInViewPane = 'maxDimElementsInViewPane';
    //const maxHorizontalElementsInViewPane = 'maxHorizontalElementsInViewPane';
    const oldVal = 'oldVal';
    const oldScrollDimVal = 'oldScrollDimVal';

    function getScrollDim(dimension: string){

        var scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

    // Get the scrollbar width
        let scrollbarWidth = scrollDiv['offset' + dimension] - scrollDiv['client' + dimension];
        document.body.removeChild(scrollDiv);
        if(scrollbarWidth === 0) scrollbarWidth = 17;
        return scrollbarWidth;
    }

    function handleScrollEventForDim(e: Event, scrollEl: polymer.Base, direction: string){
        let scrollDim: string;
        let pixelDim: string;
        switch(direction){
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
        const srcElement = e.target || e.srcElement;
        const scrollDimVal = srcElement[scrollDim];
        const newVal = Math.ceil( (scrollDimVal - 1) / scrollEl[pixelDim]) ;
        const thisOldVal = scrollEl[oldVal];
        if(newVal === thisOldVal){
            const thisOldScrollDimVal = scrollEl[oldScrollDimVal];
            if(scrollDimVal != thisOldScrollDimVal){
                srcElement[scrollDim] = srcElement[scrollDim] + (scrollDimVal - thisOldScrollDimVal);
                return;
            }
        }
        const eventDetail = {
            originalEvent: e,
            oldValue: thisOldVal,
            newValue: newVal,
        };
        //debugger;
        //Polymer.dom(this.root).setAttribute('value', newVal.toString());
        const _thisDomapi = <polymer.DomApi><any> scrollEl;
        _thisDomapi.setAttribute('value', newVal.toString());

        scrollEl.fire('scroll', eventDetail);
        scrollEl[oldVal] = newVal;
        scrollEl[oldScrollDimVal] = scrollDimVal;
    }

    const vScrollControl: polymer.Base = {
        is: 'todo-vscroll',
        properties: {
            [maxValue]: {
                type: Number,
                value: 1000,

            },
            [pixelHeight]: {
                type: Number,
                value: 291,
            },
            [maxDimElementsInViewPane]:{
                type: Number,
                value: 10,
            }
        },
        ready: function () {
            this[calculateStyles]();
        },
        [calculateStyles]: function () {
            this[outerStyle] = `height:${this[pixelHeight]}px;width:${getScrollDim('Width')}px;background-color:red;overflow-y:auto;display:inline-block`;
            const innerHeight =  (this[maxValue] - this[maxDimElementsInViewPane]) * this[pixelHeight];
            //const innerHeight = this[maxValue];
            this[innerStyle] = `height:${innerHeight}px; background-color:green`
        },
        [handleScrollEvent]: function(e: Event) {
            handleScrollEventForDim(e, this, 'v');
        }
    };



    const vScrollScript = Polymer(vScrollControl);

    const hScrollControl: polymer.Base = {
        is: 'todo-hscroll',
        properties: {
            [maxValue]: {
                type: Number,
                value: 100,
            },
            [pixelWidth]:{
                type: Number,
                value: 317
            },
            [maxDimElementsInViewPane]:{
                type: Number,
                value: 10,
            }
        },
        ready: function () {
            this[calculateStyles]();
        },
        [calculateStyles]: function () {
            this[outerStyle] = `width:${this[pixelWidth]}px;height:${getScrollDim('Height')}px;background-color:red;overflow-x:auto;display:inline-block`;
            const innerWidth = (this[maxValue] - this[maxDimElementsInViewPane]) * this[pixelWidth];
            this[innerStyle] = `width:${innerWidth}px; background-color:green`
        },
        [handleScrollEvent]: function(e: Event) {
            handleScrollEventForDim(e, this, 'h');
        }
    };

    const hScrollScript = Polymer(hScrollControl);
}
