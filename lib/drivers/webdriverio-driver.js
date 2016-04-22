'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webdriverio = require('webdriverio');

var wdio = _interopRequireWildcard(_webdriverio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebdriverIODriver = function () {
    function WebdriverIODriver(config) {
        _classCallCheck(this, WebdriverIODriver);

        this.driver = wdio.remote(config);
    }

    _createClass(WebdriverIODriver, [{
        key: 'init',
        value: function init() {
            return this.driver.init();
        }
    }, {
        key: 'url',
        value: function url(address) {
            return this.driver.url(address);
        }
    }, {
        key: 'type',
        value: function type(keys) {
            return this.driver.keys(keys);
        }
    }, {
        key: 'click',
        value: function click(elementReference) {
            return this.driver.click(elementReference);
        }
    }, {
        key: 'doubleClick',
        value: function doubleClick(elementReference) {
            return this.driver.doubleClick(elementReference);
        }
    }, {
        key: 'middleClick',
        value: function middleClick(elementReference) {
            return this.driver.middleClick(elementReference);
        }
    }, {
        key: 'moveMouseTo',
        value: function moveMouseTo(elementReference, xOffset, yOffset) {
            return this.driver.moveToObject(elementReference, xOffset, yOffset);
        }
    }, {
        key: 'rightClick',
        value: function rightClick(elementReference) {
            return this.driver.rightClick(elementReference);
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown(button) {
            button = button || 0;
            return this.driver.buttonDown(button);
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp(button) {
            button = button || 0;
            return this.driver.buttonUp(button);
        }
    }, {
        key: 'execute',
        value: function execute(func) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return this.driver.execute.apply(this.driver, [func].concat(args));
        }
    }, {
        key: 'dragAndDrop',
        value: function dragAndDrop(elementReferenceSource, elementReferenceTarget, xOffset, yOffset) {
            var _this = this;

            if (this.driver.isMobile) {
                return this.driver.getLocation(elementReferenceSource).then(function (location) {
                    return _this.driver.touchDown(location.x, location.y);
                }).getLocation(elementReferenceTarget).then(function (location) {
                    return _this.driver.touchMove(location.x, location.y).touchUp(location.x, location.y);
                });
            }

            return this.driver.moveToObject(elementReferenceSource).buttonDown().moveToObject(elementReferenceTarget, xOffset, yOffset).buttonUp();
        }
    }, {
        key: 'pause',
        value: function pause(delay) {
            return this.driver.pause(delay);
        }
    }, {
        key: 'end',
        value: function end() {
            return this.driver.end();
        }
    }, {
        key: 'element',
        value: function element(elementReference) {
            return this.driver.element(elementReference);
        }
    }, {
        key: 'elements',
        value: function elements(elementReference) {
            return this.driver.elements(elementReference);
        }
    }, {
        key: 'getValue',
        value: function getValue(elementReference) {
            return this.driver.getValue(elementReference);
        }
    }, {
        key: 'setValue',
        value: function setValue(elementReference, value) {
            return this.driver.setValue(elementReference, value);
        }
    }, {
        key: 'getTitle',
        value: function getTitle() {
            return this.driver.getTitle();
        }
    }]);

    return WebdriverIODriver;
}();

exports.default = WebdriverIODriver;