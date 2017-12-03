"use strict";
/**
 * `GlaceJS Video` plugin.
 *
 * @module
 */

var config, pluginHelp, Steps;

Object.defineProperties(exports, {
    /**
     * @type {GlaceConfig}
     */
    config: {
        get: function () {
            config = config || require("./config");
            return config;
        },
    },
    /**
     * @type {pluginHelp}
     */
    pluginHelp: {
        get: function () {
            pluginHelp = pluginHelp || require("./pluginHelp");
            return pluginHelp;
        }
    },
    /**
     * @type {VideoSteps}
     */
    Steps: {
        get: function () {
            Steps = Steps || require("./steps");
            return Steps;
        },
    },
});
