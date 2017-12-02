"use strict";
/**
 * `Video` fixtures.
 *
 * @module
 */

var CONF = require("./config");
/**
 * Fixture to capture tests video.
 *
 * @global
 * @function
 * @arg {function} func - Test funciton.
 */
global.fixVideo = func => {
    var isStarted;
    var errNumBefore;

    before(async () => {
        errNumBefore = CONF.curTestCase.errors.length;
        isStarted = await SS.startVideo();
    });

    func();

    after(async () => {
        if (!isStarted) return;
        await SS.stopVideo();
        isStarted = false;

        if (!CONF.video.save &&
                CONF.curTestCase.errors.length === errNumBefore) {
            SS.removeVideo();
        };
    });
};
