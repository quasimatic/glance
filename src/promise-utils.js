import log from "loglevel";
import Glance from "./glance";

Array.prototype.resolveSeries = function (func) {
    return this.reduce((p1, next)=> p1.then(() => func(next)), Promise.resolve());
};

Array.prototype.firstResolved = function (func) {
    return this.reduce((p1, next)=> p1.catch(() => func(next)), Promise.reject());
};

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

export default class PromiseUtils {
    constructor(promise, config) {
        this.promise = promise;

        this.config = Object.assign({
            retryCount: 3,
            retryDelay: 500
        }, config || {});
    }

    setPromise(promise) {
        this.promise = promise;
    }

    retryingPromise(func, attempt) {
        attempt = attempt || 1;

        var retryCount = this.config.retryCount;
        var retryDelay = this.config.retryDelay;

        return func().catch((reason) => {
            if (attempt <= retryCount) {
                let delayAmount = attempt * retryDelay;
                log.debug("Retrying with delay:", delayAmount)
                return delay(delayAmount).then(() => this.retryingPromise(func, ++attempt))
            }
            else {
                log.debug("Retries failed:", reason)
                throw new Error(reason);
            }
        });
    }

    waitForThen(glance, resolve, reject) {
        reject = reject || function (reason) {
                return Promise.reject(reason)
            };

        this.promise = this.promise.then((value)=> resolve.call(new Glance(glance), value), (reason)=>reject.call(new Glance(glance), reason));

        return glance;
    }

    waitForCatch(glance, reject) {
        this.promise = this.promise.catch((reason)=> reject.call(new Glance(glance), reason));
        return glance;
    }
}