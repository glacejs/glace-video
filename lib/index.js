"use strict";
/**
 * `GlaceJS Video` plugin.
 *
 * @module
 */

var config, globals, pluginHelp, Steps;

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
    globals: {
        get: function () {
            globals = globals || require("./globals");
            return globals;
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
