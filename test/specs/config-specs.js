import {createGlance} from "../test-helper"
let glance;

describe("Config", function(){
    beforeEach(function(){
        glance = createGlance();
    });

    afterEach(function(){
       glance.end();
    });

    it("should use same baseUrl", function() {
        return glance.url("/file.html");
    });
})