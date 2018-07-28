"use strict";

suite("e2e tests", () => {
    test("Record video of display", null, [fxVideo], () => {
        chunk(async () => {
            console.log("video will be saved to", $.getVideo({ check: false }));
            await $.pause(5, "just pause");
        });
    });
    
    test("Record video of browser", null, [fxKillWebdriver, fxSelenium, fxWebdriver, fxBrowser, fxVideo], () => {
        chunk(async () => {
            console.log("video will be saved to", $.getVideo({ check: false }));
            await $.pause(5, "just pause");
        });
    });
});
