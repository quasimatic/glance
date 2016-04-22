'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glance = require('./glance');

var _glance2 = _interopRequireDefault(_glance);

var _client = require('./client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTagName(g, elementReference) {
    return g.webdriver.element(elementReference).then(function (element) {
        return g.webdriver.execute(_client.getTagNameFromClient, element.value).then(function (res) {
            return res.value.toLowerCase();
        });
    });
}

function getAttribute(g, elementReference, name) {
    return g.webdriver.element(elementReference).then(function (element) {
        return g.webdriver.execute(_client.getAttributeFromClient, element.value, name).then(function (res) {
            return res.value.toLowerCase();
        });
    });
}

function selectByValue(g, elementReference, value) {
    return g.webdriver.driver.selectByValue(elementReference, value);
}

function selectByVisibleText(g, glanceSelector, elementReference, value) {
    return g.find(glanceSelector + "> option >" + value).then(function (optionReference) {
        return g.webdriver.driver.getValue(optionReference).then(function (value) {
            return this.selectByValue(elementReference, value);
        });
    });
}

exports.default = [function url(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: url");
    if (selector == "$url") {
        _loglevel2.default.debug("Setting url:", value);
        return g.webdriver.url(value);
    }

    return Promise.reject();
}, function select(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: select");
    var byValue = false;

    var data = g.parse(selector);

    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        byValue = true;
        _loglevel2.default.debug("selecting by value");
    } else {
        _loglevel2.default.debug("selecting by text");
    }

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            _loglevel2.default.debug("Found tag:", tagName);

            if (tagName === "select") {
                if (byValue) {
                    return selectByValue(g, wdioSelector, value);
                }

                return selectByVisibleText(g, selector, wdioSelector, value);
            }

            _loglevel2.default.debug("not a select");

            return Promise.reject();
        });
    }).catch(function () {
        _loglevel2.default.debug("Select not found:", selector);
        return Promise.reject();
    });
}, function value(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: value");
    var data = g.parse(selector);
    if (selector == "value" || data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1) {
        selector = selector.replace(/:value$/, "");
        return g.find(selector).then(function (wdioSelector) {
            return g.webdriver.setValue(wdioSelector, value);
        });
    }

    return Promise.reject();
}, function checkbox(g, selector, value) {
    _loglevel2.default.debug("Setter: checkbox");

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            return getAttribute(g, wdioSelector, "type").then(function (attributeType) {
                if (tagName === "input" && attributeType === "checkbox") {
                    return g.webdriver.driver.isSelected(wdioSelector).then(function (isSelected) {
                        if (isSelected != value) {
                            return g.webdriver.click(wdioSelector);
                        }
                    });
                }

                return Promise.reject();
            });
        });
    });
}, function input(g, selector, value, customSets) {
    _loglevel2.default.debug("Setter: input");

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            _loglevel2.default.debug("Found tag name:", tagName);
            if (tagName === "input" || tagName === "textarea") {
                return g.webdriver.setValue(wdioSelector, value);
            }

            return Promise.reject();
        });
    });
}, function error(g, selector, value, customSets) {
    return g.find(selector).then(function () {
        _loglevel2.default.debug("No setter found for: " + selector);
        return Promise.reject("No setter found for: " + selector);
    }, function (err) {
        _loglevel2.default.debug("Can't set " + selector + " because " + err);
        return Promise.reject("Can't set because " + err);
    });
}];