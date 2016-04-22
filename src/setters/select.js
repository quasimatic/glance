export default function select(g, selector, value, customSets) {
    log.debug("Setter: select");
    var byValue = false;

    var data = g.parse(selector);

    if (selector == "value" || (data[data.length - 1].modifiers && data[data.length - 1].modifiers.indexOf("value") != -1)) {
        selector = selector.replace(/:value$/, "");
        byValue = true;
        log.debug("selecting by value")
    }
    else {
        log.debug("selecting by text")
    }

    return g.find(selector).then(function (wdioSelector) {
        return getTagName(g, wdioSelector).then(function (tagName) {
            log.debug("Found tag:", tagName)

            if (tagName === "select") {
                if (byValue) {
                    return this.selectByValue(wdioSelector, value)
                }

                return this.selectByVisibleText(wdioSelector, value);
            }

            log.debug("not a select")

            return Promise.reject();
        })
    }).catch(function () {
        log.debug("Select not found:", selector)
        return Promise.reject();
    });
}