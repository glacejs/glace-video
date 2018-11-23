"use strict";

const _ = require("lodash");
const U = require("glace-utils");

const CONF = require("../config");

const beforeCb = opts => ctx => async () => {
    ctx.isErrorHappened = false;
    ctx.lastTestErr = getLastTestErr();
    ctx.lastSessErr = _.nth(CONF.session.errors, -1);

    ctx.isStarted = await $.startVideo(opts);
};

const afterChunkCb = ctx => () => {
    if (ctx.isErrorHappened) return;

    if (ctx.lastTestErr !== getLastTestErr()) {
        ctx.isErrorHappened = true;
        return;
    }

    if (ctx.lastSessErr !== _.nth(CONF.session.errors, -1)) {
        ctx.isErrorHappened = true;
        return;
    }
};

const afterCb = opts => ctx => async () => {
    if (!ctx.isStarted) return;
    const videoPath = await $.stopVideo();

    if (ctx.isErrorHappened || CONF.video.save || opts.save) {
        allure.attachVideo("video", videoPath);
    } else {
        await $.removeVideo();
    }
};

const getLastTestErr = () => CONF.test.curCase ? _.nth(CONF.test.curCase.errors, -1) : undefined;

/**
 * Callable fixture to capture tests video.
 *
 * @global
 * @function
 * @prop {string} [dir] - Video file folder.
 * @prop {string} [name] - Video file name.
 */
const fxVideoFunc = (opts = {}) => U.makeFixture({
    before: beforeCb(opts),
    after: afterCb(opts),
    afterChunk: afterChunkCb,
});

/**
 * Fixture to capture tests video.
 *
 * @global
 * @function
 * @arg {function} func - Test funciton.
 */
const fxVideo = fxVideoFunc();

module.exports = { fxVideo, fxVideoFunc };
