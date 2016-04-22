import {createGlance} from "../../test-helper"
import Cast from '../../../src/cast';

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

describe('Cast', function() {
    this.timeout(5000);

    beforeEach(function() {
        cast = new Cast(options);
    });

    afterEach(function() {
        cast.end();
    });

    it("should go to url", function() {
        return cast.apply({
            "$url": "file:///" + __dirname + "/examples/page1.html"
        })
            .then(() => cast.glance.webdriver.getTitle())
            .should.eventually.equal("Page 1")
    })

    it("should go to multiple urls", function() {
        return cast.apply({
            "$url": [
                "file:///" + __dirname + "/examples/page1.html",
                "file:///" + __dirname + "/examples/page2.html"
            ]
        })
            .then(() => cast.glance.webdriver.getTitle())
            .should.eventually.equal("Page 2")
    })

    it("should set value", function() {
        return cast.apply({
            "$url": "file:///" + __dirname + "/examples/page1.html",
            "text-1": "Data 1"
        })
            .then(function() {
                return cast.glance.get("text-1").should.eventually.equal("Data 1")
            })
    });

    it("should set multiple values", function() {
        return cast.apply({
            "$url": "file:///" + __dirname + "/examples/page1.html",
            "text-1": "Data 1",
            "text-2": "Data 2"
        })
            .then(function() {
                return cast.glance.get("text-1").should.eventually.equal("Data 1")
            })

            .then(function() {
                return cast.glance.get("text-2").should.eventually.equal("Data 2")
            })
    });

    it("should support url hooks", function() {
        cast = new Cast(Object.assign({
            targetHooks: [{
                after: function(cast, target) {
                    return cast.glance.webdriver.getTitle().then(function(title) {
                        if (title == "Title needs to change") {
                            return cast.glance.click("Change Title");
                        }
                    });
                }
            }]
        }, options));

        return cast.apply({
            "$url": "file:///" + __dirname + "/examples/url-hook.html"
        })
            .then(function() {
                return cast.glance.webdriver.getTitle().should.eventually.equal("Title Changed");
            })
    });

    it("should support nested labels as a glance container", function() {
        return cast.apply({
            "$url": "file:///" + __dirname + "/examples/custom-label.html",
            "wrapper-1": {
                "text-1": "Data 1",
                "text-2": "Data 2"
            }
        })
            .then(function() {
                return cast.glance.get("wrapper-1>text-1").should.eventually.equal("Data 1")
            })
            .then(function() {
                return cast.glance.get("wrapper-1>text-2").should.eventually.equal("Data 2")
            })
    });

    it("should go to multiple urls and set value", function() {
        this.timeout(10000)
        return cast.apply({"$url": "file:///" + __dirname + "/examples/page1.html"})
            .then(function() {
                return cast.apply([
                    {
                        "$url": "file:///" + __dirname + "/examples/page1.html",
                        "text-1": "Data 1"
                    },
                    {
                        "$url": "file:///" + __dirname + "/examples/page2.html",
                        "text-1": "Data 2"
                    }
                ])
            })
            .then(function() {
                return cast.glance.url("file:///" + __dirname + "/examples/page1.html")
                    .get("text-1").should.eventually.equal("Data 1");
            })
            .then(function() {
                return cast.glance.url("file:///" + __dirname + "/examples/page2.html")
                    .get("text-1").should.eventually.equal("Data 2");
            })
    });

    it("should manage context correctly", function() {
        return cast.apply({
            "$url": "file:///" + __dirname + "/examples/context.html",
            "other": {
                "input": "value",
            },
            "something": {
                "input": "value",
            },
            "label#3": {
                "input": "value"
            }
        })
    });
});