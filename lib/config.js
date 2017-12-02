"use strict";
/**
 * Configures `Video` plugin. Extends `GlaceJS` configuration.
 *
 * @namespace GlaceConfig
 * @prop {object} video - `Video` options.
 * @prop {boolean} [video.capture=false] - Flag to capture video.
 * @prop {boolean} [video.save=false] - Flag to save video for passed tests too.
 */

var U = require("glace-utils");

var config = U.config;
var args = config.args;

if (process.platform === "win32") {
    require("binary").activateFFmpeg();
};

config.video = U.defVal(config.video, {});
config.video.capture = U.defVal(args.video, false);
config.video.save = U.defVal(args.videoSave, false);

module.exports = config;
