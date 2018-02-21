"use strict";

/**
 * `Glace video` globals.
 *
 * @module
 */

var U = require("glace-utils");

var CONF = require("./config");

var gTest = global.test;

/**
 * Provides video options for [test](https://glacejs.github.io/glace-core/global.html#test)
 * and inherits its parameters.
 *
 * @global
 * @function
 * @name test
 * @arg {object} name - Test case name.
 * @arg {object} [opts] - Options.
 * @arg {boolean} [opts.withVideo=true] - Flag to capture video if it is
 *  enabled in config.
 * @arg {boolean} [opts.needVideo=false] - Flag to capture video even if it is
 *  not enabled in config.
 * @arg {string} [opts.videoName=undefinеd] - Name of video file.
 * @arg {string} [opts.videoDir=undefinеd] - Folder to put video file.
 * @arg {function[]} [fixtures] - List of [fixtures](https://glacejs.github.io/glace-core/tutorial-test-fixtures.html).
 * @arg {function} func - Function with chunks.
 * @example <caption><b>Record test video with custom name</b></caption>
 *
 * test("My test", { videoName: "my test" }, () => {
 *     chunk(async () => {
 *         await SS.openApp();
 *     });
 * });
 */
var _test = (name, opts, fixtures, func) => {

    if (opts instanceof Function) {
        func = opts;
        opts = {};
        fixtures = [];
    };
    if (fixtures instanceof Function) {
        func = fixtures;
        fixtures = [];
    };
    opts = opts || {};
    fixtures = fixtures || [];

    var withVideo = U.defVal(opts.withVideo, true);
    var needVideo = U.defVal(opts.needVideo, false);

    if (CONF.video.capture && withVideo || needVideo) {
        if (!fixtures.includes(fxVideo)) {
            fixtures.push(fxVideo.bind({ name: opts.videoName,
                                         dir: opts.videoDir }));
        };
    };

    gTest(name, opts, fixtures, func);
};

var gForEachLanguage = global.forEachLanguage;

/**
 * Provides video options for [forEachLanguage](https://glacejs.github.io/glace-core/global.html#forEachLanguage__anchor)
 * and inherits its parameters.
 *
 * @global
 * @function
 * @name forEachLanguage
 * @arg {object} [ctx] - Test case context. Contains test internal info. Is
 *  used for test `retry`.
 * @arg {object} [opts] - Options.
 * @arg {boolean} [opts.withVideo=false] - Flag to capture video if it is
 *  enabled in config.
 * @arg {boolean} [opts.needVideo=false] - Flag to capture video even if it is
 *  not enabled in config.
 * @arg {string} [opts.videoName=undefinеd] - Name of video file.
 * @arg {string} [opts.videoDir=undefinеd] - Folder to put video file.
 * @arg {function[]} [fixtures] - List of [fixtures](https://glacejs.github.io/glace-core/tutorial-test-fixtures.html).
 * @arg {function} func - Function with chunks.
 * @example <caption><b>Record video for each language separately</b></caption>
 *
 * test("My test", { withVideo: false }, ctx => {
 *     forEachLanguage(ctx, { withVideo: true }, lang => {
 *         chunk(async () => {
 *             await SS.openApp({ lang: lang });
 *         });
 *     });
 * });
 */
var _forEachLanguage = (ctx, opts, fixtures, func) => {

    if (ctx instanceof Function) {
        func = ctx;
        ctx = {};
        opts = {};
        fixtures = [];
    };
    if (opts instanceof Function) {
        func = opts;
        opts = {};
        fixtures = [];
    };
    if (fixtures instanceof Function) {
        func = fixtures;
        fixtures = [];
    };
    ctx = ctx || {};
    opts = opts || {};
    fixtures = fixtures || [];

    var withVideo = U.defVal(opts.withVideo, false);
    var needVideo = U.defVal(opts.needVideo, false);

    if (CONF.video.capture && withVideo || needVideo) {
        if (!fixtures.includes(fxVideo)) {
            fixtures.push(fxVideo.bind({ name: opts.videoName,
                                         dir: opts.videoDir }));
        };
    };

    gForEachLanguage(ctx, opts, fixtures, func);
};

global.test = _test;
global.forEachLanguage = _forEachLanguage;
