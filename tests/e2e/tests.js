"use strict";

test("Record video of display", null, [fxVideo], () => {
    chunk(async () => {
        await SS.pause(5, "just pause");
    });
});

test("Record video of browser", null, [fxKillWebdriver, fxSelenium, fxWebdriver, fxBrowser, fxVideo], () => {
    chunk(async () => {
        await SS.pause(5, "just pause");
    });
});
