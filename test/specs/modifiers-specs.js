import {createGlance} from "../test-helper"
import {nextClosestSibling} from "./helpers/modifiers";

describe('Modifiers', function() {
    let glance;

    beforeEach(function() {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/modifiers.html")
    })

    afterEach(function() {
        glance.end();
    });

    it("should get value", function() {
        glance.addModifiers(nextClosestSibling)
        return glance.get("start > label:next-closest-sibling").should.eventually.equal('label 1');
    });

})
;