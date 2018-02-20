"use strict";

var _ = require("lodash");
var glaceVideo = require("../../lib");


test("Plugin lazy import", () => {

    chunk("empty by default", () => {
        expect(_.isEmpty(glaceVideo)).to.be.true;
    });

    chunk("has config", () => {
        expect(glaceVideo.config).to.exist;
    });

    chunk("has globals", () => {
        expect(glaceVideo.globals).to.exist;
    });

    chunk("has plugin help", () => {
        expect(glaceVideo.pluginHelp).to.exist;
    });

    chunk("has steps", () => {
        expect(glaceVideo.Steps).to.exist;
    });
});
