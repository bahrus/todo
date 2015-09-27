var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function () {
    var template = "\n    <style>\n        @import url(http://fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700);\n    .container {\n        background-color: #FFF;\n        border-radius: 5px;\n        box-shadow: 0 0 5px #dadada;\n        position: relative;\n        min-height: 100px;\n        font-family: 'Roboto Condensed', sans-serif;\n        margin: 10px 0;\n    }\n    .container .left {\n        position: absolute;\n        left: 0;\n        top: 0;\n        bottom: 0;\n        width: 30%;\n        color: #FFF;\n        border-radius: 5px 0 0 5px;\n        text-align: center;\n        padding: 18px 0 0 0;\n    }\n    .container .left .month {\n        line-height: 20px;\n        font-weight: 300;\n    }\n    .container .left .day {\n        font-size: 40px\n    }\n    .container .right {\n        margin-left: 30%;\n        padding: 10px 10px 10px 15px;\n        color: #333;\n    }\n    .container .right .day-long {\n        font-weight: 300;\n        font-size: 18px;\n        line-height: 35px;\n    }\n    .container .right .time {\n        font-weight: bold;\n        font-size: 35px;\n        line-height: 40px;\n    }\n    /* THEME CODE */\n    .container.green .left {\n        background-color: #37bc9b;\n    }\n    .container.green .day-long {\n        color: #278b70;\n    }\n    .container.red .left {\n        background-color: #bc2751;\n    }\n    .container.red .day-long {\n        color: #922146;\n    }\n    .container.blue .left {\n        background-color: #356dbc;\n    }\n    .container.blue .day-long {\n        color: #2d5ea3;\n    }\n    .container.gold .left {\n        background-color: #bc9600;\n    }\n    .container.gold .day-long {\n        color: #9a7b00;\n    }\n    </style>\n    <dom-module id=\"date-widget\">\n    </dom-module>\n    <div class=\"container\">\n        <div class=\"left\">\n        <div class=\"month\"></div>\n        <div class=\"day\"></div>\n        </div>\n        <div class=\"right\">\n        <div class=\"day-long\"></div>\n        <div class=\"time\"></div>\n        </div>\n     </div>\n\n\n    ";
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var DateWidget = (function (_super) {
        __extends(DateWidget, _super);
        function DateWidget() {
            _super.apply(this, arguments);
        }
        // Fires when an instance of the element is created.
        DateWidget.prototype.createdCallback = function () {
            this['createShadowRoot']().innerHTML = template;
            //Grab the elements from the shadow root
            this['$container'] = this['shadowRoot'].querySelector('.container');
            this['$month'] = this['shadowRoot'].querySelector('.month');
            this['$day'] = this['shadowRoot'].querySelector('.day');
            this['$dayLong'] = this['shadowRoot'].querySelector('.day-long');
            this['$time'] = this['shadowRoot'].querySelector('.time');
            this.updateTheme(this.getAttribute('theme'));
            //Call the draw function initially
            this.draw();
            //Call the draw function every section to update the time
            var that = this;
            setInterval(function () {
                that.draw();
            }, 1000);
        };
        ;
        // Fires when an instance was inserted into the document.
        DateWidget.prototype.attachedCallback = function () {
        };
        ;
        // Fires when an attribute was added, removed, or updated.
        DateWidget.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
            switch (attrName) {
                case "theme":
                    this.updateTheme(newVal);
                    break;
            }
        };
        ;
        DateWidget.prototype.draw = function () {
            this['date'] = new Date();
            this['$month'].innerHTML = months[this['date'].getMonth()];
            this['$day'].innerHTML = this['date'].getDate();
            this['$dayLong'].innerHTML = days[this['date'].getDay()].toUpperCase();
            this['$time'].innerHTML = this['date'].toLocaleTimeString();
        };
        ;
        DateWidget.prototype.updateTheme = function (theme) {
            var val = "green";
            if (["green", "red", "blue", "gold"].indexOf(theme) > -1) {
                val = theme;
            }
            this['$container'].className = "container " + val;
        };
        ;
        return DateWidget;
    })(HTMLElement);
    document['registerElement']('date-widget', DateWidget);
})();
//# sourceMappingURL=date-widget.js.map