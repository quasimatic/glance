import {createGlance} from "../../test-helper"
import Cast from "../../../src/cast";

let cast;

let options = {
    driverConfig: {
        capabilities: [{
            browserName: 'phantomjs'
        }],
        logLevel: 'silent',
        coloredLogs: true,
        screenshotPath: './errorShots/',
        baseUrl: 'http://localhost',
        waitforTimeout: 5000
    }
}

describe('beforeAll Hooks', function () {
    this.timeout(5000);

    afterEach(function () {
        cast.end();
    });

    it("should allow hooking before all", function () {
        cast = new Cast(Object.assign({
            beforeAll: [
                function (cast, store) {
                    store.desiredState = store.desiredState.set("$url", store.desiredState.get("$url").replace("test.html", "before-test.html"));
                }
            ]

        }, options));

        return cast.apply({
                "$url": "file:///" + __dirname + "/examples/test.html"
            })
            .then(function () {
                return cast.glance.webdriver.getTitle().should.eventually.equal("Test")
            })
    });

    it("should chain before all hooks", function () {
        cast = new Cast(Object.assign({
            beforeAll: [
                function (cast, store) {
                    store.desiredState = store.desiredState.set("$url", store.desiredState.get("$url") + "before");
                },
                function (cast, store) {
                    store.desiredState = store.desiredState.set("$url", store.desiredState.get("$url") + "-test");
                },
                function (cast, store) {
                    store.desiredState = store.desiredState.set("$url", store.desiredState.get("$url") + ".html");
                }
            ]

        }, options));

        return cast.apply({
                "$url": "file:///" + __dirname + "/examples/"
            })
            .then(function () {
                return cast.glance.webdriver.getTitle().should.eventually.equal("Test")
            })
    });
});

describe("afterAll Hooks", function () {
    it("should allow hooking after all", function () {
        cast = new Cast(Object.assign({
            afterAll: [
                function (cast, store) {
                    store.currentState = store.currentState.set("foo", "bar");
                    return store;
                }
            ]

        }, options));

        return cast.apply({})
            .then(function (states) {
                return states.should.deep.equal({
                    "foo": "bar"
                })
            })
    });

    it("should chain after hooks", function () {
        cast = new Cast(Object.assign({
            afterAll: [
                function (cast, store) {
                    store.currentState = store.currentState.set("foo", "bar");
                },
                function (cast, store) {
                    store.currentState = store.currentState.set("abc", "123");
                },
                function (cast, store) {
                    store.currentState = store.currentState.set("another", "one");
                }
            ]

        }, options));

        return cast.apply({})
            .then(function (states) {
                return states.should.deep.equal({
                    "foo": "bar",
                    "abc": "123",
                    "another": "one"
                })
            })
    });
});

describe("Target hooks", function () {
    it("should call leave target hooks", function () {
        this.timeout(10000)
        cast = new Cast(Object.assign({
            targetHooks: [{
                labelFilter: 'after-hook-text-1',
                after: function (cast, target) {
                    return cast.glance.click("button-change");
                }
            }]
        }, options));

        return cast.apply([
                {
                    "$url": "file:///" + __dirname + "/examples/set-hooks.html",
                    "after-hook-text-1": "Data"
                }
            ])
            .then(function () {
                return cast.glance.get("text-1").should.eventually.equal("Data saved");
            });
    });

    it("should call before target hooks", function () {
        this.timeout(5000);
        cast = new Cast(Object.assign({
            targetHooks: [{
                labelFilter: 'before-hook-text-1',
                before: function (cast, target, store) {
                    target.value = "Before " + target.value
                }
            }]
        }, options));

        return cast.apply([
                {
                    "$url": "file:///" + __dirname + "/examples/set-hooks.html",
                    "before-hook-text-1": "Data"
                }
            ])
            .then(function () {
                return cast.glance.get("before-hook-text-1").should.eventually.equal("Before Data");
            });
    });

    it("should setup after hook for child targets", function () {
        this.timeout(10000);
        var values = [];
        cast = new Cast(Object.assign({
            targetHooks: [{
                labelFilter: 'parent-context',
                before: function (cast, target, store) {
                    target.continue = true;
                },
                beforeEach: function (cast, target, store) {
                    target.label = "$url";
                },
                afterEach: function (cast, target, store) {
                    return cast.glance.set(target.label, target.value).then(function () {
                        return cast.glance.webdriver.getTitle().then(function (title) {
                            values.push(title);
                        })
                    })
                }
            }]
        }, options));

        return cast.apply([
                {
                    "parent-context": {
                        "one": "file:///" + __dirname + "/examples/page1.html",
                        "two": "file:///" + __dirname + "/examples/page2.html"
                    }
                }
            ])
            .then(function () {
                return values.should.deep.equal(["Page 1", "Page 2"])
            });
    })
});

describe.skip("Custom Context", function () {
    this.timeout(10000)
    it("should support changing the context", function () {
        cast = new Cast(Object.assign({}, options));

        return cast.apply({
                "$url": "file:///" + __dirname + "/examples/custom-label.html",
                "First Wrapper": {
                    "text-1": "Data 1",
                    "text-2": "Data 2"
                }
            })
            .then(function () {
                return cast.glance.get("wrapper-1>text-1").should.eventually.equal("Data 1")
            })
            .then(function () {
                return cast.glance.get("wrapper-1>text-2").should.eventually.equal("Data 2")
            })
    });
})


/*
 TargetHooks {
 label
 before
 after
 afterEach
 beforeEach
 set
 get
 apply
 }

 handled defaults to false but should be return true indicating value has been processed

 before, beforeEach, apply, set and get can all maniuplate the target

 */