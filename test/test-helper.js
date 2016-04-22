import Glance from '../src/glance';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
chai.Should();

export function createGlance() {
    return new Glance({
        retryCount: 2,
        retryDelay: 2,
        driverConfig: {
            capabilities: [{
                browserName: 'phantomjs'
            }],
            logLevel: 'silent',
            coloredLogs: true,
            screenshotPath: './errorShots/',
            baseUrl: 'http://localhost',
            waitforTimeout: 5000
        }
    })
}