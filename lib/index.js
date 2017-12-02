"use strict";
/**
 * `GlaceJS Video` plugin.
 *
 * @module
 */

var config, Steps;

Object.defineProperties(exports, {
    /**
     * @type {GlaceConfig}
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
