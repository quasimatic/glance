import log from 'loglevel';
import Glance from "../glance";

export default function custom(g, selector, value, customSets) {
    log.debug("Setter: custom");
    var custom;

    custom = customSets[selector]
    if (!custom) {
        var match = selector.match(/.+:(.+)$/);
        if (match) {
            var label = match[1];
            if (label)
                custom = customSets[label];
        }
    }

    if (custom) {
        return Promise.resolve(custom(new Glance(g), selector.replace(/(.+):.+$/, "$1"), value));
    }

    return Promise.reject();
};