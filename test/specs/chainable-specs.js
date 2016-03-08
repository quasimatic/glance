import Glance from '../../src/glance';
let glance;

describe("Chainable", function () {
    this.timeout(5000);
    before(function () {
        glance = new Glance({
            capabilities: [{
                browserName: 'phantomjs'
            }],
            coloredLogs: true,
            screenshotPath: './errorShots/',
            baseUrl: 'http://localhost',
            waitforTimeout: 5000
        });
    });

    it("should chain promises", function () {
        return glance.url("file:///" + __dirname + "/examples/set.html")
            .set("select-1:value", "value3")
            .get("select-1:value")
            .then(function (content) {
                return content.should.equal('value3');
            })
            .then(function () {
                return glance.url("file:///" + __dirname + "/examples/chaining.html")
                    .click("Button 1")
                    .click("Button 2")
                    .get("result-1")
                    .set("input-1", "value-1")
                    .set("input-missing", "value-missing").catch(()=> {
                        return Promise.resolve();
                    })
            })
            .then(function () {
                return glance.addLabel("customlabel", function (selector) {
                        return this.convertGlanceSelector("Button 2").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
                    })
                    .get("customlabel:html").should.eventually.match(/<button.*>Button 2<\/button>/);
            })
            .then(function () {
                return glance.url("file:///" + __dirname + "/examples/chaining-2.html")
                    .click("Button A")
                    .click("Button B")
                    .get("result-a").should.eventually.equal("Result A");
            })
            .then(function () {
                return glance.addLabel("blockinglabel", function (selector) {
                        return glance.click("Custom Button").convertGlanceSelector("Custom Button").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
                    })
                    .url("file:///" + __dirname + "/examples/chaining.html")
                    .then(function () {
                        return glance.click("blockinglabel");
                    })
                    .get("input-1").should.eventually.equal("clicked")
            })

    });
})