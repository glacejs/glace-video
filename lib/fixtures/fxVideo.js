"use strict";

/**
 * Fixture to capture tests video.
 *
 * @global
 * @function
 * @name fxVideo
 * @arg {function} func - Test funciton.
 * @prop {string} [name] - Video file name.
 * @prop {string} [dir] - Video file folder.
 */

var CONF = require("../config");

module.exports = function (func) {
    var isStarted, errNumBefore, opts;
    var ctx = { isStarted, errNumBefore, opts };

    if (this && this !== global) {
        ctx.opts = { name: this.name, dir: this.dir };
    };
    before(_before(ctx));
    func();
    after(_after(ctx));
};

var _before = ctx => async () => {
    ctx.errNumBefore = CONF.test.curCase.errors.length;
    ctx.isStarted = await $.startVideo(ctx.opts);
};

var _after = ctx => async () => {
    if (!ctx.isStarted) return;
    var videoPath = await $.stopVideo();
    ctx.isStarted = false;

    if (CONF.test.curCase.errors.length === ctx.errNumBefore &&
            !CONF.video.save) {
        $.removeVideo();
    } else {
        allure.attachVideo("video", videoPath);
    };
};
