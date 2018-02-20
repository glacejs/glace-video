"use strict";

/**
 * `Glace video` globals.
 *
 * @module
 */

var U = require("glace-utils");

var CONF = require("./config");

var gTest = global.test;
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
