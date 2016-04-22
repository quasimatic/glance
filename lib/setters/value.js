"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = value;
function value(g, selector, value, customSets) {
    log.debug("Setter: value");
    var data = g.parse(selector);
    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        return g.find(selector).then(function (wdioSelector) {
            return g.webdriver.setValue(wdioSelector, value);
        });
    }

    return Promise.reject();
}