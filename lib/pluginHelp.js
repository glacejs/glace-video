"use strict";
/**
 * `Video` plugin help.
 * 
 * @function
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
