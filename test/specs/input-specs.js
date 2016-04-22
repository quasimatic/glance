import {createGlance} from "../test-helper"

let glance;

describe('Input get', function() {
    beforeEach(function() {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/get.html")
    })

    afterEach(function() {
        glance.end();
    });

    it("should get value", function() {
        return glance.get("input-1").should.eventually.equal('value 1');
    });

    it("should get text", function() {
        return glance.get("label-1").should.eventually.equal('label 1');
    });

    it("should get selected text by default", function() {
        return glance.get("select-1").should.eventually.equal('text2');
    });

    it("should get selected value", function() {
        return glance.get("select-1:value").should.eventually.equal('value2');
    });

    it("should get select option text by default", function() {
        return glance.get("select-1>text1").should.eventually.equal('text1');
    });

    it("should get select option value", function() {
        return glance.get("select-1>text1:value").should.eventually.equal('value1');
    });

    it("should get using a custom label", function() {
        return glance.addGetter("complex-control-1", function(g) {
            return g.get("special-widget>span")
        })
            .get("complex-control-1").should.eventually.equal('special value 1');
    });
});

describe('Input set', function() {
    beforeEach(function() {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/set.html")
    })

    afterEach(function() {
        glance.end();
    });

    it("should set value", function() {
        return glance.set("input-1", "value 1")
            .get("input-1").should.eventually.equal('value 1');
    });

    it("should set value on textarea", function() {
        return glance.set("textarea-1", "value 1")
            .get("textarea-1").should.eventually.equal('value 1');
    });

    it.skip("should not set text", function() {
        return glance.set("label-1", "label 1").catch(function(err) {
            err.message.should.equal("label-1 text not changable");
        })
    });

    it("should set select text by default", function() {
        return glance.set("select-1", "text3")
            .get("select-1").should.eventually.equal('text3');
    });

    it("should set select text with non breaking spaces", function() {
        return glance.set("select-1", "text2")
            .get("select-1").should.eventually.equal('\u00A0\u00A0\u00A0\u00A0text2');
    });

    it("should set select value", function() {
        return glance.set("select-1:value", "value3")
            .get("select-1:value").should.eventually.equal('value3');
    });

    it("should set checkbox", function() {
        return glance.set("checkbox-1", true)
            .get("checkbox-1").should.eventually.equal(true);
    })

    it("should set using a custom label", function() {
        return glance.addSetter("complex-control-1", function(g, value) {
            return g.set("wrapper-1>special-widget>input", "special value 1")
        })
            .set("complex-control-1", "special value 1")
            .get("special-container>special-widget>input").should.eventually.equal('special value 1');
    });

    it.skip("should set using a modifier", function() {
        return glance.addSetter("complex-control-1", function(g, selector, value) {
            return g.set(selector + ">wrapper-1>special-widget>input", "special value 1")
        })
            .set("special-container:complex-control-1", "special value 1")
            .get("special-container>special-widget>input").should.eventually.equal('special value 1');
    });


    it("should set a non element custom label", function() {
        return glance.addSetter("non-element", function(g, value) {
            return g.set("wrapper-1>special-widget-2>input", value)
        })
            .set("non-element", "special value 2")
            .get("special-container>special-widget-2>input").should.eventually.equal('special value 2');
    });

    it("should reject if it can't set a readonly element", function(done) {
        this.timeout(30000)

        glance.set("readonly-element", "value 1").catch(function(err) {
            try {
                err.message.should.equal("No setter found for: readonly-element")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });


    it("should reject if it can't find a setter", function(done) {
        this.timeout(30000)

        glance.set("non-existing", "value 1").catch(function(err) {
            try {
                err.message.should.equal("Can't set because Error: Element not found: non-existing")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });

    it("should reject if it finds duplicates", function(done) {
        glance.set("duplicate-element", "value 1").catch(function(err) {
            try {
                err.message.should.equal("Can't set because Error: Found 2 duplicates for: duplicate-element")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });
});

describe("page setters", function() {
    beforeEach(function() {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/set.html")
    })

    afterEach(function() {
        glance.end();
    });

    it("should change the url by a setter", function() {
        return glance.set("$url", "file:///" + __dirname + "/examples/set-2.html")
            .then(function() {
                return glance.webdriver.getTitle().should.eventually.equal("NEW SET TEST PAGE");
            })
    });
});