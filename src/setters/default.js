import log from 'loglevel';
import Glance from "./glance";
import {getTagNameFromClient} from './client';

function getTagName(g, elementReference) {
    return g.webdriver.element(elementReference).then(element => {
        return g.webdriver.execute(getTagNameFromClient, element.value)
            .then(res => res.value.toLowerCase())
    });
}


export default function (g, selector, value, customSets) {


        
}


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