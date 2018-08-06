"use strict";
/**
 * Creates a new instance of VideoRecorder.
 *
 * @class
 * @name VideoRecorder
 * @classdesc contains methods to record video for tests
 * @arg {object} [opts] - Options.
 * @arg {object} [opts._process] - Injected `process` module.
 * @arg {object} [opts._which] - Injected `which` module.
 * @arg {object} [opts._spawn] - Injected `spawn` module.
 * @property {boolean} [isRunning=false] - flag is video recorder running or no
 * @property {?string} [filePath=null] - path video file
 */

var path = require("path");

var spawn = require("cross-spawn");
var which = require("which");
var U = require("glace-utils");
var LOG = U.logger;

var VideoRecorder = function (opts) {
    opts = U.defVal(opts, {});

    this.isRunning = false;
    this.filePath = null;

    this._process = null;
    this._recordOpts = null;

    this.__process = U.defVal(opts._process, process);
    this.__which = U.defVal(opts._which, which);
    this.__spawn = U.defVal(opts._spawn, spawn);
};
/**
 * Configures video recorder.
 *
 * @method
 * @arg {object} [opts] - recorder configuration
 * @arg {string} [opts.path] - video file path
 * @arg {number} [opts.fps=30] - video framerate
 * @arg {number} [opts.width=1024] - video width
 * @arg {number} [opts.height=768] - video height
 * @arg {number} [opts.x=0] - `X`-offset on display
 * @arg {number} [opts.y=0] - `Y`-offset on display
 */
VideoRecorder.prototype.configure = function (opts) {
    opts = U.defVal(opts, {});
    opts.fps = U.defVal(opts.fps, 30);
    opts.width = U.defVal(opts.width, 1024);
    opts.height = U.defVal(opts.height, 768);
    opts.x = U.defVal(opts.x, 0);
    opts.y = U.defVal(opts.y, 0);
    opts.size = opts.width + "x" + opts.height;
    this.filePath = U.defVal(opts.path, path.resolve(U.cwd, "out.avi"));

    if (this.__process.platform === "win32") {

        this.__which.sync("ffmpeg");
        this._recordCmd = "ffmpeg";
        this._recordOpts = [ "-y",
            "-loglevel", "quiet",
            "-video_size", opts.size,
            "-offset_x", opts.x,
            "-offset_y", opts.y,
            "-draw_mouse", 0,
            "-framerate", opts.fps,
            "-f", "gdigrab",
            "-i", "desktop",
            "-vcodec", "libx264",
            this.filePath ];

    } else if (this.__process.platform === "linux") {

        if (this.__which.sync("avconv", { nothrow: true })) {
            this._recordCmd = "avconv";
        } else if (this.__which.sync("ffmpeg", { nothrow: true })) {
            this._recordCmd = "ffmpeg";
        } else {
            throw new Error("not found: avconv or ffmpeg");
        };
        this._recordOpts = [ "-y",
            "-loglevel", "quiet",
            "-f", "x11grab",
            "-r", opts.fps,
            "-s", opts.size,
            "-i", `${process.env.DISPLAY}+${opts.x},${opts.y}`,
            "-codec", "libx264",
            this.filePath ];

    } else if (this.__process.platform === "darwin") {

        this.__which.sync("ffmpeg");
        this._recordCmd = "ffmpeg";
        this._recordOpts = [ "-y",
            "-loglevel", "quiet",
            "-f", "avfoundation",
            "-r", opts.fps,
            "-i", "1:",
            "-vsync", 2,
            this.filePath ];

    } else {
        throw new Error("Video capture isn't supported " +
                        `on platform '${this.__process.platform}'`);
    };
};
/**
 * Starts video recorder.
 *
 * @method
 * @throws {Error} if video recorder is started already
 * @throws {Error} if video recorder isn't configured yet
 */
VideoRecorder.prototype.start = function () {
    if (this.isRunning) return;
    if (!this._recordOpts)
        throw new Error("Video recorder isn't configured yet");

    this._process = this.__spawn(this._recordCmd, this._recordOpts,
        { killSignal: "SIGINT" });
    this.isRunning = true;
};
/**
 * Stops video recorder.
 *
 * @method
 * @throws {Error} if video recorder isn't started yet
 */
VideoRecorder.prototype.stop = function () {
    if (!this.isRunning) return;

    return new Promise((resolve, reject) => {
        this._process.on("exit", (code, signal) => {
            LOG.debug(`${this._recordCmd} was stopped with ` +
                         `code ${code} and signal ${signal}`);
            this.isRunning = false;
            resolve();
        });
        this._process.on("error", reject);
        var result = this._process.kill("SIGINT");
        if (!result) reject(new Error(`Oops! Can't kill ${this._recordCmd}`));
    });
};

module.exports = VideoRecorder;
