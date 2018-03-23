"use strict";

var path = require("path");

var LOG = require("glace-utils").logger;

var Steps = require("../../lib").Steps;

scope("Steps", () => {
    var ctx;

    beforeChunk(() => {
        ["warn", "debug", "error", "info"].forEach(m => LOG[m] = sinon.spy());
        ctx = {};
        ctx.pause = sinon.spy();
        ctx.video = {
            configure: sinon.spy(),
            start: sinon.spy(),
            isRunning: true,
            filePath: "/path/to/video.avi",
        };
        ctx.__resolution = {
            get: sinon.stub().returns({ width: 1024, height: 768 }),
        };
    });

    test(".startVideo()", () => {

        beforeChunk(() => {
            ctx.startVideo = Steps.startVideo;
            ctx._videoLocation = sinon.stub()
                .returns({ x: 0, y: 1, width: 2, height: 3 });
            ctx._makeVideoPath = sinon.stub();
        });

        chunk("skipped if video capture is started already", async () => {
            ctx._isVideoStarted = true;
            expect(await ctx.startVideo()).to.be.false;
            expect(LOG.warn.calledOnce).to.be.true;
        });

        [function the_same () {},
            function the_new () {
                ctx.__VideoRecorder = function () {
                    this.configure = sinon.spy();
                    this.start = sinon.spy();
                    this.isRunning = true;
                };
            }].forEach(_before => {
            chunk(`uses ${_before.name} recorder instance`, async () => {
                _before();

                expect(await ctx.startVideo()).to.be.true;

                expect(ctx._videoLocation.calledOnce).to.be.true;
                expect(ctx._makeVideoPath.calledOnce).to.be.true;

                expect(ctx.video.configure.calledOnce).to.be.true;
                expect(ctx.video.configure.args[0][0].x).to.be.equal(0);
                expect(ctx.video.configure.args[0][0].y).to.be.equal(1);
                expect(ctx.video.configure.args[0][0].width).to.be.equal(2);
                expect(ctx.video.configure.args[0][0].height).to.be.equal(3);

                expect(ctx.video.start.calledOnce).to.be.true;
                expect(ctx.pause.calledOnce).to.be.true;
                expect(ctx._isVideoStarted).to.be.true;
            });
        });

        chunk("doesn't check that video is running if option is set", async () => {
            ctx.video.isRunning = false;
            expect(await ctx.startVideo({ check: false })).to.be.true;
        });

        chunk("throws error if video capture isn't launched", async () => {
            ctx.video.isRunning = false;
            await expect(ctx.startVideo()).to.be.rejectedWith("wasn't launched");
        });
    });

    test(".stopVideo()", () => {

        beforeChunk(() => {
            ctx._isVideoStarted = true;
            ctx.stopVideo = Steps.stopVideo;
            ctx.video.stop = sinon.spy();
            ctx.video.isRunning = false;
        });

        chunk("skipped if video recording isnät launched", async () => {
            ctx._isVideoStarted = false;
            expect(await ctx.stopVideo()).to.be.false;
            expect(LOG.warn.calledOnce).to.be.true;
        });

        chunk("stops video", async () => {
            expect(await ctx.stopVideo()).to.be.equal("/path/to/video.avi");
            expect(ctx.pause.calledOnce).to.be.true;
            expect(ctx.video.stop.calledOnce).to.be.true;
            expect(ctx._isVideoStarted).to.be.false;
        });

        chunk("doesn't check video stop if flag is set", async () => {
            ctx.video.isRunning = true;
            expect(await ctx.stopVideo({ check: false }))
                .to.be.equal("/path/to/video.avi");
            expect(ctx.pause.calledOnce).to.be.true;
            expect(ctx.video.stop.calledOnce).to.be.true;
            expect(ctx._isVideoStarted).to.be.false;
        });

        chunk("throws error if video isn't stopped", async () => {
            ctx.video.isRunning = true;
            await expect(ctx.stopVideo())
                .to.be.rejectedWith("was still running");
        });
    });

    test(".getVideo()", () => {

        beforeChunk(() => {
            ctx.getVideo = Steps.getVideo;
            ctx.video.isRunning = false;
        });

        chunk("throws error if video recorder isn't init", () => {
            delete ctx.video;
            expect(() => ctx.getVideo()).to.throw("isn't initialized");
        });

        chunk("gets video path", () => {
            expect(ctx.getVideo()).to.be.equal("/path/to/video.avi");
        });

        chunk("don't check video file if flag is set", () => {
            ctx.video.isRunning = true;
            expect(ctx.getVideo({ check: false }))
                .to.be.equal("/path/to/video.avi");
        });

        chunk("throws error if video is running", () => {
            ctx.video.isRunning = true;
            expect(() => ctx.getVideo()).to.throw("still recording");
        });

        chunk("throws error if video file isn't specified", () => {
            delete ctx.video.filePath;
            expect(() => ctx.getVideo()).to.throw("it's empty");
        });
    });

    test(".removeVideo()", () => {

        beforeChunk(() => {
            ctx.removeVideo = Steps.removeVideo;
            ctx.__fs = {
                existsSync: sinon.stub().returns(true),
                unlinkSync: sinon.spy(),
            };
        });

        chunk("skipped if video file isn't specified", () => {
            delete ctx.video.filePath;
            expect(ctx.removeVideo()).to.be.false;
            expect(LOG.warn.calledOnce).to.be.true;
        });

        chunk("skipped if video file doesn't exist", () => {
            ctx.__fs.existsSync = sinon.stub().returns(false);
            expect(ctx.removeVideo()).to.be.false;
            expect(LOG.warn.calledOnce).to.be.true;
        });

        chunk("removes video file", () => {
            ctx.__fs.existsSync = sinon.stub();
            ctx.__fs.existsSync.onCall(0).returns(true);
            ctx.__fs.existsSync.onCall(1).returns(false);

            expect(ctx.removeVideo()).to.be.true;
            expect(ctx.__fs.unlinkSync.calledOnce).to.be.true;
            expect(ctx.__fs.existsSync.calledTwice).to.be.true;
        });

        chunk("doesn't check that file is removed if flag is set", () => {
            expect(ctx.removeVideo({ check: false })).to.be.true;
            expect(ctx.__fs.unlinkSync.calledOnce).to.be.true;
        });

        chunk("throws error if file wasn't remove", () => {
            expect(() => ctx.removeVideo()).to.throw("wasn't removed");
        });
    });

    test("._videoLocation()", () => {

        beforeChunk(() => {
            ctx._videoLocation = Steps._videoLocation;
            ctx.webdriver = {
                windowHandlePosition: () => {
                    return { value: { x: 10, y: 11 } };
                },
                windowHandleSize: () => {
                    return { value: { width: 21, height: 31 }};
                },
                session: () => true,
            };
        });

        chunk("captures browser size if browser is launched", async () => {
            var res = await ctx._videoLocation();
            expect(res.x).to.be.equal(10);
            expect(res.y).to.be.equal(11);
            expect(res.width).to.be.equal(21);
            expect(res.height).to.be.equal(31);
        });

        chunk("captures screen size if browser isn't launched", async () => {
            ctx.webdriver.session = () => false;
            var res = await ctx._videoLocation();
            expect(res.x).to.be.equal(0);
            expect(res.y).to.be.equal(0);
            expect(res.width).to.be.equal(1024);
            expect(res.height).to.be.equal(768);
        });

        chunk("captures screen size if browser isn't init", async () => {
            delete ctx.webdriver;
            var res = await ctx._videoLocation();
            expect(res.x).to.be.equal(0);
            expect(res.y).to.be.equal(0);
            expect(res.width).to.be.equal(1024);
            expect(res.height).to.be.equal(768);
        });

        chunk("throws error that browser out of screen", async () => {
            ctx.__resolution = {
                get: sinon.stub().returns({ width: 0, height: 0 }),
            };
            await expect(ctx._videoLocation())
                .to.be.rejectedWith("outside of screen");
        });
    });

    test("._makeVideoPath()", () => {

        beforeChunk(() => {
            ctx._makeVideoPath = Steps._makeVideoPath;
        });

        chunk("generates new file name", () => {
            var res = ctx._makeVideoPath();
            var filename = path.basename(res);

            expect(filename.endsWith(".avi")).to.be.true;
            expect(filename.length).to.be.above(4);
        });

        [ "it's my file name", "it's my file name.avi" ].forEach(fileName => {
            chunk(`transforms to kebab file name '${fileName}'`, () => {
                var res = ctx._makeVideoPath({ name: fileName });
                expect(path.basename(res)).to.be.equal("it-s-my-file-name.avi");
            });
        });

        chunk("uses passed folder path", () => {
            var myPath = path.resolve(CONF.reportsDir, "my", "custom", "path");
            var res = ctx._makeVideoPath({ dir: myPath });
            expect(path.dirname(res)).to.be.equal(myPath);
        });
    });
});
