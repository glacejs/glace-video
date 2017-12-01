"use strict";
/**
 * `GlaceJS Video` package.
 *
 * @module
 */

var config, Steps;

Object.defineProperties(exports, {
    /**
     * `Video` config.
     */
    config: {
        get: function() {
            config = config || require("./config");
            return config;
        },
    },
    /**
     * @type {VideoSteps}
     */
    Steps: {
        get: function() {
            Steps = Steps || require("./steps");
            return Steps;
        },
    },
});
