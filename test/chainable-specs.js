import {createGlance} from "./test-helper"
let glance;

describe("Chainable", function() {
    this.timeout(10000)
    beforeEach(function() {
        glance = createGlance();
    });

    afterEach(function() {
        glance.end();
    });

    it("should chain promises", function() {
        return glance.url("file:///" + __dirname + "/examples/set.html")
            .set("select-1:value", "value3")
            .get("select-1:value")
            .then(function(content) {
                return content.should.equal('value3');
            })
            .then(function() {
                return glance.url("file:///" + __dirname + "/examples/chaining.html")
                    .click("Button 1")
                    .click("Button 2")
                    .get("result-1")
                    .set("input-1", "value-1")
                    .set("input-missing", "value-missing").catch(()=> {
                        return Promise.resolve();
                    })
            })
            .then(function() {
                glance.addExtension({
                    labels: {
                        "customlabel": {
                            locate: function(selector, {glance}) {
                                return glance.find("Button 2").then((wdioSelector)=> {
                                    return glance.browser.element(wdioSelector)
                                });
                            }
                        }
                    }
                });

                return glance.get("customlabel:html").should.eventually.match(/<button.*>Button 2<\/button>/);
            })
            .then(function() {
                return glance.url("file:///" + __dirname + "/examples/chaining-2.html")
                    .click("Button A")
                    .click("Button B")
                    .get("result-a").should.eventually.equal("Result A");
            })
            .then(function() {
                return glance.addExtension({
                    labels: {
                        "blockinglabel": {
                            locate: function(selector, {glance}) {
                                return glance.find("Custom Button").then((wdioSelector)=> glance.browser.element(wdioSelector))
                            }
                        }
                    }
                })
                    .url("file:///" + __dirname + "/examples/chaining.html")
                    .then(function() {
                        return glance.click("blockinglabel");
                    })
                    .get("input-1").should.eventually.equal("clicked")
            })
    });
})