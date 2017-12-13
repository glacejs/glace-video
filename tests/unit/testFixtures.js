"use strict";

require("../../lib/fixtures");

scope("fixtures", () => {

    test("fxVideo", () => {
        var calls,
            oBefore,
            oAfter,
            oStartVideo,
            oStopVideo,
            oRemoveVideo;

        beforeChunk(() => {
            oBefore = global.before;
            oAfter = global.after;
            oStartVideo = SS.startVideo;
            oStopVideo = SS.stopVideo;
            oRemoveVideo = SS.removeVideo;

            calls = Promise.resolve()
            global.before = cb => calls = calls.then(cb);
            global.after = cb => calls = calls.then(cb);

            SS.stopVideo = sinon.spy();
            SS.removeVideo = sinon.spy();
        });

        afterChunk(() => {
            global.before = oBefore;
            global.after = oAfter;
            SS.startVideo = oStartVideo;
            SS.stopVideo = oStopVideo;
            SS.removeVideo = oRemoveVideo;
        });

        chunk("exists globally", () => {
            expect(fxVideo).to.exist;
        });

        chunk("starts and stops video capture", async () => {
            SS.startVideo = sinon.stub().returns(true);
            fxVideo(() => {});
            await calls;

            expect(SS.startVideo.calledOnce).to.be.true;
            expect(SS.stopVideo.calledOnce).to.be.true;
            expect(SS.removeVideo.calledOnce).to.be.true;
        });

        chunk("doesn't stop video capture if it wasn't started", async () => {
            SS.startVideo = sinon.stub().returns(false);
            fxVideo(() => {});
            await calls;

            expect(SS.startVideo.calledOnce).to.be.true;
            expect(SS.stopVideo.calledOnce).to.be.false;
            expect(SS.removeVideo.calledOnce).to.be.false;
        });

        chunk("doesn't remove video file on passed tests if flag is provided", async () => {
            SS.startVideo = sinon.stub().returns(true);
            CONF.video.save = true;
            fxVideo(() => {});
            await calls;

            expect(SS.startVideo.calledOnce).to.be.true;
            expect(SS.stopVideo.calledOnce).to.be.true;
            expect(SS.removeVideo.calledOnce).to.be.false;
        });
    });
});
