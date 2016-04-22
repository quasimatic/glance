import {createGlance} from "../test-helper"
let glance;

describe('Window', function () {
    beforeEach(function () {
        glance = createGlance();
    });

    afterEach(function(){
        glance.end();
    });

    it("should change focus to popup window", function () {
        glance.webdriver.driver.addCommand("activateNewWindow", function () {
            return this.getTabIds().then(function (handles) {
                return this.getCurrentTabId().then(function (current) {
                    if (handles[0] == current)
                        return this.window(handles[1])
                    else
                        return this.window(handles[0])
                })
            })
        });

        glance.webdriver.driver.addCommand("activateOnlyWindow", function () {
            return this.getTabIds()
                .then(function (handles) {
                    return this.window(handles[0])
                })
        });

        return glance.url("file:///" + __dirname + "/examples/window.html")
            .click("Popup")
            .then(function () {
                return glance.webdriver.driver.activateNewWindow()
                    .then(function () {
                        return glance.get("Popup Window:html").should.eventually.match(/<div.*>Popup Window<\/div>/);
                    })
            })
            .click("Close")
            .then(function () {
                return glance.webdriver.driver.activateOnlyWindow();
            })
            .get("Popup:html").should.eventually.match(/<a.*href="\.\/new-window.html" target="_blank".*>Popup<\/a>/);
    });
})
