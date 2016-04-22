export default {
    set(cast, target, store) {
        var label = target.label;
        var value = target.value;
        var glance = cast.glance;

        var fullLabel = label;

        if (target.context.length > 0)
            fullLabel = target.context.join(">") + ">" + label;

        return glance.set(fullLabel, value).then(function() {
            target.handled = true;
            return target;
        })
    },

    get(cast, target, store) {
        var label = target.label;
        var context = target.context;
        var glance = cast.glance;

        var fullLabel = label;

        if (target.context.length > 0)
            fullLabel = target.context.join(">") + ">" + label;

        return glance.get(fullLabel)
            .then(currentValue => {
                return {
                    label: label,
                    value: currentValue,
                    context: context,
                    handled: true
                };
            });
    },

    process(cast, target, store) {
        if(target.value == null) {
            return this.get(cast, target, store);
        }

        if (typeof(target.value) == "object") {
            target.context.push(target.label);
            return Promise.resolve(target);
        }

        return this.set(cast, target, store).then((setTarget) =>{
            return this.get(cast, target, store);
        })
    }
}