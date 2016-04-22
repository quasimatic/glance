import {createGlance} from "../test-helper"
let glance;

describe('Error Messages', function () {
    beforeEach(function () {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/errors.html")
    });

    afterEach(function(){
        glance.end();
    });

    it("should show correct error within a chain", function () {
        return glance
            .click('non-existing-button-1')
            .click('non-existing-button-2')
            .should.be.rejectedWith("Element not found: non-existing-button-1");

    });

    it("should show detail errors when settings", function(){
        this.timeout(10000)
        glance.addSetter("custom-setter", function(g, value){
            return g.cast({
                "missing-element": value
            })
        });

        return glance.set("custom-setter", "value").should.be.rejectedWith("Element not found: missing-element");
    });
});