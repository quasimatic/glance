import {createGlance} from "../test-helper"
let glance;

describe('Drag and Drop', function () {
	before(function() {
		glance = createGlance();
		return glance.url("file:///" + __dirname + "/examples/drag-and-drop.html")
	});

	after(function(){
		glance.end();
	})

	it("should drag and drop an item", function() {
		return glance.dragAndDrop("item-1", "item-2")
	});
});