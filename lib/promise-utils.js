"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loglevel = require("loglevel");

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glance = require("./glance");

var _glance2 = _interopRequireDefault(_glance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Array.prototype.resolveSeries = function (func) {
    return this.reduce(function (p1, next) {
        return p1.then(function () {
            return func(next);
        });
    }, Promise.resolve());
};

Array.prototype.firstResolved = function (func) {
    return this.reduce(function (p1, next) {
        return p1.catch(function () {
            return func(next);
        });
    }, Promise.reject());
};

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
}

var PromiseUtils = function () {
    function PromiseUtils(promise, config) {
        _classCallCheck(this, PromiseUtils);

        this.promise = promise;

        this.config = Object.assign({
            retryCount: 3,
            retryDelay: 500
        }, config || {});
    }

    _createClass(PromiseUtils, [{
        key: "setPromise",
        value: function setPromise(promise) {
            this.promise = promise;
        }
    }, {
        key: "retryingPromise",
        value: function retryingPromise(func, attempt) {
            var _this = this;

            attempt = attempt || 1;

            var retryCount = this.config.retryCount;
            var retryDelay = this.config.retryDelay;

            return func().catch(function (reason) {
                if (attempt <= retryCount) {
                    var delayAmount = attempt * retryDelay;
                    _loglevel2.default.debug("Retrying with delay:", delayAmount);
                    return delay(delayAmount).then(function () {
                        return _this.retryingPromise(func, ++attempt);
                    });
                } else {
                    _loglevel2.default.debug("Retries failed:", reason);
                    throw new Error(reason);
                }
            });
        }
    }, {
        key: "waitForThen",
        value: function waitForThen(glance, resolve, reject) {
            reject = reject || function (reason) {
                return Promise.reject(reason);
            };

            this.promise = this.promise.then(function (value) {
                return resolve.call(new _glance2.default(glance), value);
            }, function (reason) {
                return reject.call(new _glance2.default(glance), reason);
            });

            return glance;
        }
    }, {
        key: "waitForCatch",
        value: function waitForCatch(glance, reject) {
            this.promise = this.promise.catch(function (reason) {
                return reject.call(new _glance2.default(glance), reason);
            });
            return glance;
        }
    }]);

    return PromiseUtils;
}();

exports.default = PromiseUtils;