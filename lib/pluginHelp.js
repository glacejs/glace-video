"use strict";

/**
 * Plugin help.
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
            "force-video": {
                describe: d("Capture video of executed tests.",
                            "Video will be saved even if test is passed."),
                type: "boolean",
                group: "Video:",
            },
        });
};
