"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = custom;

var _loglevel = require("loglevel");

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glance = require("../glance");

var _glance2 = _interopRequireDefault(_glance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function custom(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: custom");
    var custom;

    custom = customSets[selector];
    if (!custom) {
        var match = selector.match(/.+:(.+)$/);
        if (match) {
            var label = match[1];
            if (label) custom = customSets[label];
        }
    }

    if (custom) {
        return Promise.resolve(custom(new _glance2.default(g), selector.replace(/(.+):.+$/, "$1"), value));
    }

    return Promise.reject();
};