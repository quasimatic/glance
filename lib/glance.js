'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cast = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glanceSelector = require('../lib/glance-selector');

var _glanceSelector2 = _interopRequireDefault(_glanceSelector);

var _client = require('./client');

var _getStrategies = require('./get-strategies');

var _getStrategies2 = _interopRequireDefault(_getStrategies);

var _setStrategies = require('./set-strategies');

var _setStrategies2 = _interopRequireDefault(_setStrategies);

var _webdriverioDriver = require('./drivers/webdriverio-driver');

var _webdriverioDriver2 = _interopRequireDefault(_webdriverioDriver);

var _glanceSelector3 = require('glance-selector');

var _promiseUtils = require('./promise-utils');

var _promiseUtils2 = _interopRequireDefault(_promiseUtils);

var _cast = require('./cast');

var _cast2 = _interopRequireDefault(_cast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var customGets = [];
var customSets = [];

var Glance = function () {
    function Glance(config) {
        var _this = this;

        _classCallCheck(this, Glance);

        this.config = config.config || config;
        this.promiseUtils = new _promiseUtils2.default(new Promise(function (resolve, reject) {
            if (config.logLevel) {
                _this.setLogLevel(config.logLevel);
            }

            if (config.webdriver) {
                _this.customLabels = config.customLabels || {};
                _this.modifiers = config.modifiers || {};
                _this.webdriver = config.webdriver;
                resolve();
            } else if (config.driverConfig) {
                _this.customLabels = {};
                _this.modifiers = {};
                _this.webdriver = new _webdriverioDriver2.default(config.driverConfig);
                _this.webdriver.init().then(resolve);
            } else {
                console.log("A driver or driverConfig must be provided.");
                reject();
            }
        }), this.config);
    }

    _createClass(Glance, [{
        key: 'parse',
        value: function parse(reference) {
            return _glanceSelector3.Parser.parse(reference);
        }
    }, {
        key: 'setLogLevel',
        value: function setLogLevel(level) {
            _loglevel2.default.setLevel(level);
            this.logLevel = level;
            return this;
        }
    }, {
        key: 'wrapPromise',
        value: function wrapPromise(func) {
            return this.promiseUtils.waitForThen(this, function () {
                return this.promiseUtils.retryingPromise(func);
            });
        }
    }, {
        key: 'url',
        value: function url(address) {
            var _this2 = this;

            return this.wrapPromise(function () {
                return _this2.webdriver.url(address);
            });
        }
    }, {
        key: 'end',
        value: function end() {
            var _this3 = this;

            return this.wrapPromise(function () {
                return _this3.webdriver.end();
            });
        }

        //
        // Cast
        //

    }, {
        key: 'cast',
        value: function cast(state) {
            var _this4 = this;

            return this.wrapPromise(function () {
                return new _cast2.default(new Glance(_this4)).apply(state);
            });
        }

        //
        // Interactions
        //

    }, {
        key: 'type',
        value: function type(text) {
            var _this5 = this;

            return this.wrapPromise(function () {
                return _this5.webdriver.keys(text);
            });
        }
    }, {
        key: 'click',
        value: function click(selector) {
            var _this6 = this;

            return this.wrapPromise(function () {
                return _this6.find(selector).then(function (wdioSelector) {
                    _loglevel2.default.info("Clicking:", selector);
                    return _this6.webdriver.click(wdioSelector);
                });
            });
        }
    }, {
        key: 'doubleClick',
        value: function doubleClick(selector) {
            var _this7 = this;

            return this.wrapPromise(function () {
                return _this7.find(selector).then(function (wdioSelector) {
                    return _this7.webdriver.doubleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'middleClick',
        value: function middleClick(selector) {
            var _this8 = this;

            return this.wrapPromise(function () {
                return _this8.find(selector).then(function (wdioSelector) {
                    return _this8.webdriver.middleClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'rightClick',
        value: function rightClick(selector) {
            var _this9 = this;

            return this.wrapPromise(function () {
                return _this9.find(selector).then(function (wdioSelector) {
                    return _this9.webdriver.rightClick(wdioSelector);
                });
            });
        }
    }, {
        key: 'moveMouseTo',
        value: function moveMouseTo(selector, xOffset, yOffset) {
            var _this10 = this;

            return this.wrapPromise(function () {
                return _this10.find(selector).then(function (wdioSelector) {
                    return _this10.webdriver.moveToObject(wdioSelector, xOffset, yOffset);
                });
            });
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown() {
            var _this11 = this;

            return this.wrapPromise(function () {
                return _this11.webdriver.buttonDown(0);
            });
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp() {
            var _this12 = this;

            return this.wrapPromise(function () {
                return _this12.webdriver.buttonUp(0);
            });
        }
    }, {
        key: 'dragAndDrop',
        value: function dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
            var _this13 = this;

            return this.wrapPromise(function () {
                return Promise.all([_this13.find(sourceSelector), _this13.find(targetSelector)]).then(function (result) {
                    return _this13.webdriver.dragAndDrop(result[0], result[1], xOffset, yOffset);
                });
            });
        }
    }, {
        key: 'pause',
        value: function pause(delay) {
            var _this14 = this;

            return this.wrapPromise(function () {
                return _this14.webdriver.pause(delay);
            });
        }
    }, {
        key: 'setCustomLabels',
        value: function setCustomLabels(labels) {
            Object.assign(this.customLabels, labels);
        }

        //
        // Labels
        //

    }, {
        key: 'addLabel',
        value: function addLabel(label, func) {
            var _this15 = this;

            return this.wrapPromise(function () {
                if (_this15.customLabels[label]) _this15.customLabels[label].locator = func;else _this15.customLabels[label] = { locator: func };
                return Promise.resolve();
            });
        }

        //
        // Modifiers
        //

    }, {
        key: 'addModifiers',
        value: function addModifiers(modifiers) {
            var _this16 = this;

            return this.wrapPromise(function () {
                Object.assign(_this16.modifiers, modifiers);
                return Promise.resolve();
            });
        }

        //
        // Getters and Setters
        //

    }, {
        key: 'get',
        value: function get(selector) {
            var _this17 = this;

            var g = new Glance(this);
            return this.wrapPromise(function () {
                if (_this17.customLabels[selector] && _this17.customLabels[selector].get) {
                    return Promise.resolve(_this17.customLabels[selector].get(g));
                } else {
                    return _getStrategies2.default.firstResolved(function (getStrategy) {
                        return getStrategy(g, selector, customGets);
                    });
                }
            });
        }
    }, {
        key: 'set',
        value: function set(selector) {
            var _this18 = this;

            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            var g = new Glance(this);
            return this.wrapPromise(function () {
                if (_this18.customLabels[selector] && _this18.customLabels[selector].set) {
                    return Promise.resolve(_this18.customLabels[selector].set.apply(_this18, [].concat(g, values)));
                } else {
                    return _setStrategies2.default.firstResolved(function (setStrategy) {
                        return setStrategy(g, selector, values[0], customSets);
                    });
                }
            });
        }
    }, {
        key: 'addGetter',
        value: function addGetter(label, lookup) {
            var _this19 = this;

            return this.wrapPromise(function () {
                if (_this19.customLabels[label]) _this19.customLabels[label].get = lookup;else _this19.customLabels[label] = { get: lookup };

                return Promise.resolve();
            });
        }
    }, {
        key: 'addSetter',
        value: function addSetter(label, lookup) {
            var _this20 = this;

            return this.wrapPromise(function () {
                if (_this20.customLabels[label]) _this20.customLabels[label].set = lookup;else _this20.customLabels[label] = { set: lookup };

                customSets[label] = lookup;
                return Promise.resolve();
            });
        }

        //
        // Script excecution
        //

    }, {
        key: 'execute',
        value: function execute(func) {
            var _this21 = this;

            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return this.wrapPromise(function () {
                return _this21.webdriver.execute(func, args);
            });
        }

        //
        // Glance selector
        //

    }, {
        key: 'glanceElement',
        value: function glanceElement(selector, resolvedLabels, multiple) {
            var _this22 = this;

            var mergedLabels = Object.assign({}, this.customLabels, resolvedLabels);
            var logLevel = this.logLevel;

            return this.webdriver.execute(_glanceSelector2.default).then(function () {
                var resolvedCustomLabels = Object.keys(mergedLabels).reduce(function (previous, current) {
                    previous[current] = mergedLabels[current].locator;
                    return previous;
                }, {});

                return _this22.webdriver.execute(_client.addModifiersToBrowser, (0, _client.serializeModifiers)(_this22.modifiers)).then(function (res) {
                    return _this22.webdriver.execute(_client.GlanceSelector, selector, resolvedCustomLabels, multiple, logLevel).then(function (res) {
                        var val = [].concat(res.value);

                        var ids = val.map(function (e) {
                            return _shortid2.default.generate();
                        });

                        return { val: val, ids: ids };
                    }).then(function (_ref) {
                        var val = _ref.val;
                        var ids = _ref.ids;

                        return _this22.webdriver.execute(_client.tagElementWithID, val, ids).then(function () {
                            var idsAsCss = ids.map(function (id) {
                                return '[data-glance-id="' + id + '"]';
                            });

                            return this.log("browser").then(function (logs) {
                                _loglevel2.default.debug("CLIENT:", logs.value.map(function (l) {
                                    return l.message;
                                }).join("\n").replace(/ \(undefined:undefined\)/g, ''));

                                if (idsAsCss.length == 0) {
                                    throw new Error("Element not found: " + selector);
                                }

                                if (idsAsCss.length == 1) {
                                    return idsAsCss[0];
                                }

                                if (multiple) {
                                    return idsAsCss.join(",");
                                }

                                if (idsAsCss.length > 1) {
                                    throw new Error("Found " + idsAsCss.length + " duplicates for: " + selector);
                                }
                            });
                        });
                    });
                });
            });
        }
    }, {
        key: 'getCustomLabeledElements',
        value: function getCustomLabeledElements(reference) {
            var _this23 = this;

            return new Promise(function (resolve, reject) {

                var data = _this23.parse(reference);
                var labels = data.map(function (r) {
                    return r.label;
                });

                var foundLabels = labels.filter(function (label) {
                    return _this23.customLabels[label] && typeof _this23.customLabels[label].locator == 'function';
                });

                var resolvedCustomLabels = {};
                foundLabels.resolveSeries(function (key) {
                    var g = new Glance(_this23);

                    return Promise.resolve(_this23.customLabels[key].locator(g, key)).then(function (element) {
                        resolvedCustomLabels[key] = { locator: element.value };
                    });
                }).then(function () {
                    resolve(resolvedCustomLabels);
                });
            });
        }
    }, {
        key: 'find',
        value: function find(selector) {
            var _this24 = this;

            return this.getCustomLabeledElements(selector).then(function (labels) {
                return _this24.glanceElement(selector, labels);
            });
        }
    }, {
        key: 'then',
        value: function then(onFulfilled, onRejected) {
            onFulfilled = onFulfilled || function (value) {
                return Promise.resolve(value);
            };
            onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

            var g = this;
            return this.promiseUtils.waitForThen(g, function (value) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onFulfilled(value));
            }, function (reason) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onRejected(reason));
            });
        }
    }, {
        key: 'catch',
        value: function _catch(onRejected) {
            onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

            var g = this;
            return this.promiseUtils.waitForCatch(g, function (reason) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onRejected(reason));
            });
        }
    }]);

    return Glance;
}();

exports.Cast = _cast2.default;
exports.default = Glance;