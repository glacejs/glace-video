"use strict";
/**
 * Steps for video recording.
 *
 * @mixin VideoSteps
 * @prop {VideoRecorder} video - Video recorder instance.
 */

var fs = require("fs");
var path = require("path");

var _ = require("lodash");
var expect = require("chai").expect;
var resolution = require("screen-resolution");
var uuid = require("uuid/v4");
var U = require("glace-utils");
var LOG = U.logger;

require("./fixtures");
var VideoRecorder = require("./video");

var VideoSteps = {
    /* modules */
    __fs: fs,
    __resolution: resolution,
    __VideoRecorder: VideoRecorder,

    startVideo: async function (opts) {
        /**
         * Step to start video recording. Step recall will be skipped if video
         *  recording wasn't stopped before.
         *
         * @async
         * @memberOf VideoSteps
         * @method startVideo
         * @instance
         * @arg {object} [opts] - Step options.
         * @arg {string} [opts.name] - File name. Extension `.avi` will be
         *  added automatically. Default name will be generated with `uuid`
         *  algorithm.
         * @arg {string} [opts.dir] - Folder to save video.
         * @arg {boolean} [opts.check=true] - Flag to check that video recording
         *  was launched.
         * @return {Promise<boolean>} `true` if step was executed, `false` if
         *  was skipped.
         * @throws {AssertionError} If video recording wasn't launched.
         */

        if (this._isVideoStarted) {
            LOG.warn("Step to start video recording was passed already");
            return false;
        };

        opts = U.defVal(opts, {});
        var check = U.defVal(opts.check, true);

        LOG.info("Starting video recording...");

        this.video = this.video || new this.__VideoRecorder();

        var videoOpts = await this._videoLocation();
        videoOpts.path = this._makeVideoPath(opts);
        allure.step(`Record video to ${videoOpts.path}`);

        this.video.configure(videoOpts);
        this.video.start();
        await this.pause(1, "it needs a time to start recording");

        if (check) {
            expect(this.video.isRunning,
                "Video recording wasn't launched")
                .to.be.true;
        };

        this._isVideoStarted = true;

        LOG.info("Video recording is started");
        allure.pass();

        return true;
    },

    stopVideo: async function (opts) {
        /**
         * Step to stop video recording. Step call will be skipped if video
         *  recording wasn't launched before.
         *
         * @async
         * @memberOf VideoSteps
         * @method stopVideo
         * @instance
         * @arg {object} [opts] - Step options.
         * @arg {boolean} [opts.check=true] - Flag to check that video recording
         *  was stopped.
         * @return {Promise<string>} Path to recorded video.
         * @return {Promise<boolean>} `false` if step was skipped.
         * @throws {AssertionError} If video recording wasn't stopped.
         */

        if (!this._isVideoStarted) {
            LOG.warn("Step to start video recording wasn't passed yet");
            return false;
        };

        opts = U.defVal(opts, {});
        var check = U.defVal(opts.check, true);

        allure.step("Stop video recording");
        LOG.info("Stopping video recording...");

        await this.pause(1, "it needs a time to gather latest frames");
        await this.video.stop();

        if (check) {
            expect(this.video.isRunning,
                "Video recording was still running")
                .to.be.false;
        };

        this._isVideoStarted = false;

        LOG.info("Video recording is stopped");
        allure.pass();

        return this.video.filePath;
    },

    getVideo: function (opts) {
        /**
         * Step to get path to recorded video.
         *
         * @memberOf VideoSteps
         * @method getVideo
         * @instance
         * @arg {object} [opts] - Step options.
         * @arg {boolean} [opts.check=true] - Flag to check that video is recorded
         *  and path exists.
         * @return {string} Path to recorded video.
         */

        allure.step("Get video file");

        expect(this.video,
            "Video recorder isn't initialized").to.exist;

        opts = U.defVal(opts, {});
        var check = U.defVal(opts.check, true);

        LOG.info("Getting recorded video path...");

        if (check) {
            expect(this.video.isRunning,
                "Can't get recorded video file path, " +
                   "because video is still recording").to.be.false;
            expect(this.video.filePath,
                "Can't get recorded video file path, " +
                   "because it's empty").to.not.be.empty;
        };

        LOG.info("Recorded video path is got");
        allure.pass();

        return this.video.filePath;
    },

    removeVideo: function (opts) {
        /**
         * Step to remove recorded video.
         *
         * @memberOf VideoSteps
         * @method removeVideo
         * @instance
         * @arg {object} [opts] - Step options.
         * @arg {boolean} [opts.check=true] - Flag to check step result.
         * @return {boolean} `true` if step was executed, `false` if was skipped.
         * @throws {AssertionError} If video file wasn't removed.
         */

        if (!this.video.filePath || !this.__fs.existsSync(this.video.filePath)) {
            LOG.warn("Video file doesn't exist");
            return false;
        };

        opts = U.defVal(opts, {});
        var check = U.defVal(opts.check, true);

        allure.step("Remove recorded video");
        LOG.info("Removing recorded video file...");

        this.__fs.unlinkSync(this.video.filePath);

        if (check) {
            expect(this.__fs.existsSync(this.video.filePath),
                `Video file '${this.video.filePath}' wasn't removed`)
                .to.be.false;
        };

        LOG.info("Recorded video file is removed");
        allure.pass();

        return true;
    },
    /**
     * Helper to get video location.
     * 
     * @async
     * @method
     * @instance
     * @protected
     * @return {Promise<object>} Dict of location.
     */
    _videoLocation: async function () {
        var loc = {};
        var screen = await this.__resolution.get();
        var screenLoc = { x: 0, y: 0,
            width: screen.width,
            height: screen.height };

        if (this.webdriver && await this.webdriver.session()) {

            _.assign(loc,
                (await this.webdriver.windowHandlePosition()).value);
            _.assign(loc,
                (await this.webdriver.windowHandleSize()).value);

            expect(U.isInScreen(loc, screenLoc),
                "Browser is outside of screen").to.be.true;

            if (loc.x < 0) loc.x = 0;
            if (loc.y < 0) loc.y = 0;
            if (loc.x + loc.width > screen.width) {
                loc.width = screen.width - loc.x;
            };
            if (loc.y + loc.height > screen.height) {
                loc.height = screen.height - loc.y;
            };

        } else {
            loc = screenLoc;
        };

        expect(loc.width, "Invalid video width").to.be.above(0);
        expect(loc.height, "Invalid video height").to.be.above(0);

        return loc;
    },
    /**
     * Helper to make video path.
     *
     * @method
     * @instance
     * @protected
     * @arg {object} [opts] - Step options.
     * @arg {string} [opts.name] - File name. Extension `.avi` will be
     *  added automatically. Default name will be generated with `uuid`
     *  algorithm.
     * @arg {string} [opts.dir] - Folder to save video.
     * @return {string} Full video path.
     */
    _makeVideoPath: function (opts) {
        opts = U.defVal(opts, {});

        var fileName = U.toKebab(U.defVal(opts.name, uuid()));
        if (!fileName.endsWith(".avi")) fileName += ".avi";

        var testName = CONF.curTestCase ? U.toKebab(CONF.curTestCase.name) : "";
        return U.mkpath(
            U.defVal(opts.dir,
                path.resolve(CONF.reportsDir, testName, "videos")),
            fileName);
    },
};

module.exports = VideoSteps;
