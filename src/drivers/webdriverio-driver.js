import * as wdio from 'webdriverio';

class WebdriverIODriver {
    constructor(config) {
        this.driver = wdio.remote(config);
    }

    init() {
        return this.driver.init();
    }

    url(address) {
        return this.driver.url(address)
    }

    type(keys) {
        return this.driver.keys(keys)
    }

    click(elementReference) {
        return this.driver.click(elementReference)
    }

    doubleClick(elementReference) {
        return this.driver.doubleClick(elementReference)
    }

    middleClick(elementReference) {
        return this.driver.middleClick(elementReference)
    }

    moveMouseTo(elementReference, xOffset, yOffset) {
        return this.driver.moveToObject(elementReference, xOffset, yOffset)
    }

    rightClick(elementReference) {
        return this.driver.rightClick(elementReference)
    }

    mouseDown(button) {
        button = button || 0;
        return this.driver.buttonDown(button)
    }

    mouseUp(button) {
        button = button || 0;
        return this.driver.buttonUp(button)
    }

    execute(func, ...args) {
        return this.driver.execute.apply(this.driver, [func].concat(args));
    }

    dragAndDrop(elementReferenceSource, elementReferenceTarget, xOffset, yOffset) {
        if (this.driver.isMobile) {
            return this.driver.getLocation(elementReferenceSource).then(
                (location) => this.driver.touchDown(location.x, location.y)
            ).getLocation(elementReferenceTarget).then(
                (location) => this.driver.touchMove(location.x, location.y).touchUp(location.x, location.y)
            )
        }

        return this.driver.moveToObject(elementReferenceSource).buttonDown().moveToObject(elementReferenceTarget, xOffset, yOffset).buttonUp()
    }

    pause(delay) {
        return this.driver.pause(delay)
    }

    end() {
        return this.driver.end()
    }

    element(elementReference) {
        return this.driver.element(elementReference);
    }

    elements(elementReference) {
        return this.driver.elements(elementReference);
    }

    getValue(elementReference) {
        return this.driver.getValue(elementReference)
    }

    setValue(elementReference, value) {
        return this.driver.setValue(elementReference, value)
    }

    getTitle() {
        return this.driver.getTitle();
    }
}

export default WebdriverIODriver;