"use strict";

/**
 * `Glace video` globals.
 *
 * @module
 */

const _ = require("lodash");
const U = require("glace-utils");

const CONF = require("./config");

const gScope = global.scope;

/**
 * Extends `scope` function by addition options to manage video recording.
 * Cause it overrides `scope`, all functions, which use global `scope` inside,
 * can pass its options as well.
 * 
 * @global
 * @function scope
 * @arg {string} name - Scope name.
 * @arg {function[]} [fixtures] - List of fixtures.
 * @arg {object} [opts] - Options, which extends basic options.
 * @arg {string} [opts.videoName] - Name of video file.
 * @arg {string} [opts.videoDir] - Folder to save video file.
 * @arg {boolean} [opts.videoSave] - Flag to save video even if all is passed inside.
 * @arg {boolean} [opts.video] - Flag to capture video with default options.
 * Used if above options are missed.
 * @arg {function} func - Callback with tests or chunks.
 */
const _scope = (name, fixtures, opts, func) => {

    if (_.isFunction(opts)) [func, opts] = [opts];
    if (_.isPlainObject(fixtures)) [opts, fixtures] = [fixtures];
    if (_.isFunction(fixtures)) [func, fixtures] = [fixtures];

    fixtures = fixtures || [];
    opts = opts || {};

    const video = !!U.defVal(
        opts.video, opts.videoName, opts.videoDir, opts.videoSave, false);

    if (video || CONF.video.capture) {
        if (!fixtures.includes(fxVideo)) {
            fixtures = [fxVideoFunc({
                name: opts.videoName,
                dir: opts.videoDir,
                save: opts.videoSave,
            })].concat(fixtures);
        }
    }

    gScope(name, fixtures, opts, func);
};

global.scope = _scope;
