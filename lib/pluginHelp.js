"use strict";
/**
 * `Video` plugin help.
 * 
 * @function
 * @name pluginHelp
 * @arg {yargs} yargs - `yargs` instance in order to expand its options.
 * @arg {function} d - Function to manage option description: join, colorize, etc.
 * @return {yargs} - Expanded `yargs` instance.
 */
module.exports = (args, d) => {
    return args
        .options({
            "video": {
                describe: d("Capture video of executed tests.",
                            "Video will be removed if test is passed."),
                type: "boolean",
                group: "Video:",
            },
            "video-save": {
                describe: d("Save video for passed tests too if video is",
                            "captured."),
                type: "boolean",
                group: "Video:",
            },
        });
};
