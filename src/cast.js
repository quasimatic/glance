import Glance from "./glance";
import GlanceConverter from "./converters/glance-converter";
import PromiseUtils from "./promise-utils";
import Immutable from 'immutable'

var converters = [GlanceConverter];

function getTargetHooks(cast, target) {
    return cast.targetHooks.filter(function(hook) {
        return !hook.labelFilter || target.label == hook.labelFilter;
    })
}

function processTargets(cast, state, store, parentTarget) {
    parentTarget = parentTarget || {
            context: [],
            hooks: []
        };

    return Object.keys(state).resolveSeries(label => {
        let values = [].concat(state[label]);

        return values.resolveSeries(value => {
            var target = {
                label: label,
                value: value,
                context: parentTarget.context
            };

            var targetHooks;

            return converters.firstResolved(converter => {
                return parentTarget.hooks.resolveSeries(hook => hook.beforeEach(cast, target, store))
                    .then(() => {
                        targetHooks = getTargetHooks(cast, target);
                        return targetHooks.resolveSeries(hook => hook.before(cast, target, store))
                    })
                    .then(()=> {
                        if(target.continue) {
                           return target;
                        }
                        else {
                            return converter.process(cast, target, store);
                        }
                    })
                    .then(evaluatedTarget => {
                        return targetHooks.resolveSeries(hook => hook.after(cast, evaluatedTarget, store))
                            .then(()=> {
                                if (!evaluatedTarget.handled) {
                                    evaluatedTarget.hooks = [];

                                    evaluatedTarget.hooks = evaluatedTarget.hooks.concat(parentTarget.hooks)

                                    evaluatedTarget.hooks = evaluatedTarget.hooks.concat(targetHooks);

                                    return processTargets(cast, value, store, evaluatedTarget).then(()=>{
                                        parentTarget.context.pop()
                                    });
                                }

                                return Promise.resolve(evaluatedTarget).then(evaluatedTarget => {
                                    store.currentState = store.currentState.updateIn(target.context.concat(target.label), value => evaluatedTarget.value);
                                    return parentTarget.hooks.resolveSeries(hook => hook.afterEach(cast, evaluatedTarget, store))
                                });
                            })
                    })
            })
        })
    })
}

class Cast {
    constructor(options) {
        if(options.glance) {
            this.glance = options.glance;
        }
        else {
            this.glance = new Glance(options);
        }

        this.beforeAll = options.beforeAll || [];
        this.afterAll = options.afterAll || [];

        this.targetHooks = (options.targetHooks || []).map(function(hook) {
            return Object.assign({
                labelFilter: null,
                before: function() {
                },
                after: function() {
                },
                beforeEach: function() {
                },
                afterEach: function() {
                },
                set: function() {
                },
                get: function() {
                },
                apply: function() {
                }
            }, hook)
        });

        this.targetEnter = options.targetEnter || [];
        this.targetLeave = options.targetLeave || [];

        this.literals = options.literals || [];

        this.logLevel = options.logLevel || "error";
        this.glance.setLogLevel(this.logLevel);
    }

    apply(state) {
        var stores = [];
        var states = [].concat(state);

        return states.resolveSeries((state) => {
                let store = {
                    desiredState: Immutable.Map(state),
                    currentState: Immutable.Map({})
                };

                return this.beforeAll.resolveSeries(beforeAll => beforeAll(this, store))
                    .then(()=> processTargets(this, store.desiredState.toJS(), store))
                    .then(()=> this.afterAll.resolveSeries(afterAll => afterAll(this, store)))
                    .then(()=> stores.push(store))
            })
            .then(function() {
                if (stores.length == 1) {
                    return stores[0].currentState.toJS();
                }
                else {
                    return stores.map(s => s.currentState.toJS());
                }
            })
    }

    end() {
        return this.glance.webdriver.end();
    }
}

export default Cast;