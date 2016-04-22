function tagElementWithID(elements, ids) {
    for (var i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("data-glance-id", ids[i]);
    }
}

function waitForChange(element, name) {
    return element.getAttribute(name)
}

function GlanceSelector(selector, customLabels, multiple, logLevel) {
    glanceSelector.addCustomLabels(customLabels);
    glanceSelector.setLogLevel(logLevel);
    return glanceSelector(selector);
}

function getAttributeFromClient(element, name) {
    return element.getAttribute(name);
}

function addModifiersToBrowser(modifierString) {
    function functionReviver(key, value) {
        if (key === "") return value;
        if (typeof value === 'string') {
            var startOfFunc = /^function[^\(]*\(([^\)]*)\)[^\{]*\{/;
            var match = value.match(startOfFunc);

            if (match) {
                 var args = match[1].split(',').map(function(arg) { return arg.replace(/\s+/, ''); });
                 return new Function(args, value.replace(startOfFunc, '').replace(/\}$/, ''));
             }
        }

        return value;
    }

    var modifiers = JSON.parse(modifierString, functionReviver);
    glanceSelector.addModifiers(modifiers);
}

function serializeModifiers(modifiers) {
    function functionReplacer(key, value) {
        if (typeof(value) === 'function') {
            return value.toString();
        }
        return value;
    }

    var browserSideModifiers = Object.keys(modifiers).reduce((o, k) => {
        if(modifiers[k].browser) {
            o[k] = modifiers[k];
        }
        return o;
    }, {});

    return JSON.stringify(browserSideModifiers, functionReplacer);
}

function getTagNameFromClient(element) {
    return element.tagName;
}

function getTextFromClient(element) {
    return element.textContent;
}

function getUrlFromClient() {
    return document.location.href
}

function getHTMLFromClient(element) {
    return element.outerHTML;
}

function getSelectTextFromClient(select) {
    var i = select.selectedIndex;
    if (i == -1) return;

    return select.options[i].text;
}

export {addModifiersToBrowser}
export {serializeModifiers}
export {getAttributeFromClient};
export {getTagNameFromClient};
export {getTextFromClient};
export {getUrlFromClient};
export {getHTMLFromClient};
export {getSelectTextFromClient};

export {waitForChange};
export {tagElementWithID};
export {GlanceSelector};

export default GlanceSelector