"use strict";
/**
 * Configures `Video` plugin.
 * 
 * @module
 */

var U = require("glace-utils");

var config = U.config;
var args = config.args;

config.video = U.defVal(config.video, {});
config.video.capture = U.defVal(args.video, false);
config.video.save = U.defVal(args.videoSave, false);

module.exports = config;
