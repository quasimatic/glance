import {createGlance} from "../test-helper"
let glance;

describe('Timing', function () {
    beforeEach(function () {
        glance = createGlance();
    });

    afterEach(function(){
        glance.end();
    });

    it("should retry finding selector", function () {
        return glance.url("file:///" + __dirname + "/examples/timing.html")
            .get("Appearing Item:html").should.eventually.match(/<div.*>Appearing Item<\/div>/);
    });

    it.skip("should retry failed action", function() {
        var retry = 0;
        /*glance.webdriverio.addCommand("glanceElement", function(selector, customLabels, multiple) {
         return glance.webdriverio.searchClient(selector, customLabels, multiple, 0).then(function (id) {
         if(retry == 3)
         return id;

         return glance.execute(function(){
         var button = document.getElementById("button-1");
         button.parentNode.removeChild(button);
         setTimeout(function(){
         document.body.appendChild(button)
         }, 1000)
         }).then(function () {
         ++retry;
         return id;
         });
         });
         }, true);
         */
        glance.url("file:///" + __dirname + "/examples/timing.html");

        glance.click("Button 1");
    });
});