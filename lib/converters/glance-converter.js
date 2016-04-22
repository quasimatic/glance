"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = {
    set: function set(cast, target, store) {
        var label = target.label;
        var value = target.value;
        var glance = cast.glance;

        var fullLabel = label;

        if (target.context.length > 0) fullLabel = target.context.join(">") + ">" + label;

        return glance.set(fullLabel, value).then(function () {
            target.handled = true;
            return target;
        });
    },
    get: function get(cast, target, store) {
        var label = target.label;
        var context = target.context;
        var glance = cast.glance;

        var fullLabel = label;

        if (target.context.length > 0) fullLabel = target.context.join(">") + ">" + label;

        return glance.get(fullLabel).then(function (currentValue) {
            return {
                label: label,
                value: currentValue,
                context: context,
                handled: true
            };
        });
    },
    process: function process(cast, target, store) {
        var _this = this;

        if (target.value == null) {
            return this.get(cast, target, store);
        }

        if (_typeof(target.value) == "object") {
            target.context.push(target.label);
            return Promise.resolve(target);
        }

        return this.set(cast, target, store).then(function (setTarget) {
            return _this.get(cast, target, store);
        });
    }
};