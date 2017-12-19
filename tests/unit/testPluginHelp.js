"use strict";

var pluginHelp = require("../../lib").pluginHelp;

test("plugin help contains option", () => {

    var opts = pluginHelp({ options: opts => opts }, d => d);

    chunk("video", () => {
        expect(opts["video"]).to.exist;
    });

    chunk("video-save", () => {
        expect(opts["video-save"]).to.exist;
    });
});
