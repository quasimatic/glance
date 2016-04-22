"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glance = require("./glance");

var _glance2 = _interopRequireDefault(_glance);

var _glanceConverter = require("./converters/glance-converter");

var _glanceConverter2 = _interopRequireDefault(_glanceConverter);

var _promiseUtils = require("./promise-utils");

var _promiseUtils2 = _interopRequireDefault(_promiseUtils);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var converters = [_glanceConverter2.default];

function getTargetHooks(cast, target) {
    return cast.targetHooks.filter(function (hook) {
        return !hook.labelFilter || target.label == hook.labelFilter;
    });
}

function processTargets(cast, state, store, parentTarget) {
    parentTarget = parentTarget || {
        context: [],
        hooks: []
    };

    return Object.keys(state).resolveSeries(function (label) {
        var values = [].concat(state[label]);

        return values.resolveSeries(function (value) {
            var target = {
                label: label,
                value: value,
                context: parentTarget.context
            };

            var targetHooks;

            return converters.firstResolved(function (converter) {
                return parentTarget.hooks.resolveSeries(function (hook) {
                    return hook.beforeEach(cast, target, store);
                }).then(function () {
                    targetHooks = getTargetHooks(cast, target);
                    return targetHooks.resolveSeries(function (hook) {
                        return hook.before(cast, target, store);
                    });
                }).then(function () {
                    if (target.continue) {
                        return target;
                    } else {
                        return converter.process(cast, target, store);
                    }
                }).then(function (evaluatedTarget) {
                    return targetHooks.resolveSeries(function (hook) {
                        return hook.after(cast, evaluatedTarget, store);
                    }).then(function () {
                        if (!evaluatedTarget.handled) {
                            evaluatedTarget.hooks = [];

                            evaluatedTarget.hooks = evaluatedTarget.hooks.concat(parentTarget.hooks);

                            evaluatedTarget.hooks = evaluatedTarget.hooks.concat(targetHooks);

                            return processTargets(cast, value, store, evaluatedTarget).then(function () {
                                parentTarget.context.pop();
                            });
                        }

                        return Promise.resolve(evaluatedTarget).then(function (evaluatedTarget) {
                            store.currentState = store.currentState.updateIn(target.context.concat(target.label), function (value) {
                                return evaluatedTarget.value;
                            });
                            return parentTarget.hooks.resolveSeries(function (hook) {
                                return hook.afterEach(cast, evaluatedTarget, store);
                            });
                        });
                    });
                });
            });
        });
    });
}

var Cast = function () {
    function Cast(options) {
        _classCallCheck(this, Cast);

        if (options.glance) {
            this.glance = options.glance;
        } else {
            this.glance = new _glance2.default(options);
        }

        this.beforeAll = options.beforeAll || [];
        this.afterAll = options.afterAll || [];

        this.targetHooks = (options.targetHooks || []).map(function (hook) {
            return Object.assign({
                labelFilter: null,
                before: function before() {},
                after: function after() {},
                beforeEach: function beforeEach() {},
                afterEach: function afterEach() {},
                set: function set() {},
                get: function get() {},
                apply: function apply() {}
            }, hook);
        });

        this.targetEnter = options.targetEnter || [];
        this.targetLeave = options.targetLeave || [];

        this.literals = options.literals || [];

        this.logLevel = options.logLevel || "error";
        this.glance.setLogLevel(this.logLevel);
    }

    _createClass(Cast, [{
        key: "apply",
        value: function apply(state) {
            var _this = this;

            var stores = [];
            var states = [].concat(state);

            return states.resolveSeries(function (state) {
                var store = {
                    desiredState: _immutable2.default.Map(state),
                    currentState: _immutable2.default.Map({})
                };

                return _this.beforeAll.resolveSeries(function (beforeAll) {
                    return beforeAll(_this, store);
                }).then(function () {
                    return processTargets(_this, store.desiredState.toJS(), store);
                }).then(function () {
                    return _this.afterAll.resolveSeries(function (afterAll) {
                        return afterAll(_this, store);
                    });
                }).then(function () {
                    return stores.push(store);
                });
            }).then(function () {
                if (stores.length == 1) {
                    return stores[0].currentState.toJS();
                } else {
                    return stores.map(function (s) {
                        return s.currentState.toJS();
                    });
                }
            });
        }
    }, {
        key: "end",
        value: function end() {
            return this.glance.webdriver.end();
        }
    }]);

    return Cast;
}();

exports.default = Cast;