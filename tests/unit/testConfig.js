"use strict";

test("config contains", () => {

    chunk("video section", () => {
        expect(CONF.video).to.exist;
    });

    chunk("disabled video capture", () => {
        expect(CONF.video.capture).to.be.false;
    });

    chunk("disabled video save", () => {
        expect(CONF.video.save).to.be.false;
    });
});
