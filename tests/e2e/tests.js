"use strict";

test("Record video of display", null, [fxVideo], () => {
    chunk(async () => {
        console.log("video will be saved to", SS.getVideo({ check: false }));
        await SS.pause(5, "just pause");
    });
});

test("Record video of browser", null, [fxKillWebdriver, fxSelenium, fxWebdriver, fxBrowser, fxVideo], () => {
    chunk(async () => {
        console.log("video will be saved to", SS.getVideo({ check: false }));
        await SS.pause(5, "just pause");
    });
});
