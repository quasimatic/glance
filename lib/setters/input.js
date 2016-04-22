"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = input;
function input(g, selector, value, customSets) {
    log.debug("Setter: input");

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            log.debug("Found tag name:", tagName);
            if (tagName === "input" || tagName === "textarea") {
                return g.webdriver.setValue(wdioSelector, value);
            }

            return Promise.reject();
        });
    });
}