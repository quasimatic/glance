'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (g, selector, value, customSets) {};

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _glance = require('./glance');

var _glance2 = _interopRequireDefault(_glance);

var _client = require('./client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// function error(g, selector, value, customSets) {
//     return g.find(selector).then(function () {
//             log.debug("No setter found for: " + selector)
//             return Promise.reject("No setter found for: " + selector);
//         },
//         function (err) {
//             log.debug("Can't set " + selector + " because " + err)
//             return Promise.reject("Can't set because " + err)
//         });
// }]


function getTagName(g, elementReference) {
    return g.webdriver.element(elementReference).then(function (element) {
        return g.webdriver.execute(_client.getTagNameFromClient, element.value).then(function (res) {
            return res.value.toLowerCase();
        });
    });
}