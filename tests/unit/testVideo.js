"use strict";

var path = require("path");

var U = require("glace-utils");

var VideoRecorder = require("../../lib/video");

scope("Video", () => {
    var video;

    beforeChunk(() => {
        video = new VideoRecorder({
            _process: { platform: "win32" },
            _which: { sync: sinon.spy() },
            _spawn: sinon.stub().returns(true),
        });
    });

    test("instance", () => {

        chunk("not running", () => {
            expect(video.isRunning).to.be.false;
        });

        chunk("doesn't have file path", () => {
            expect(video.filePath).to.not.exist;
        });
    });

    test(".configure()", () => {

        chunk("uses default options", () => {
            video.configure();
            expect(video.filePath).to.be.equal(path.resolve(U.cwd, "out.avi"));
            expect(video._recordOpts)
                .to.include.members([
                    /* size */ "1024x768",
                    /* x */ 0,
                    /* y */ 0,
                    /* fps */ 30,
                    /* file path */ video.filePath,
                ]);
        });

        chunk("uses passed options", () => {
            video.configure({
                path: "/path/to/video.avi",
                fps: 24,
                width: 800,
                height: 600,
                x: 10,
                y: 20,
            });

            expect(video.filePath).to.be.equal("/path/to/video.avi");
            expect(video._recordOpts)
                .to.include.members([
                    /* size */ "800x600",
                    /* x */ 10,
                    /* y */ 20,
                    /* fps */ 24,
                    /* file path */ video.filePath,
                ]);
        });

        chunk("throws error if ffmpeg wasn't found on windows", () => {
            video.__which.sync = () => {
                throw Error("ffmpeg not found");
            };
            expect(() => video.configure()).to.throw("ffmpeg not found");
        });

        chunk("throws error if neither ffmpeg nor avconv weren't found on linux", () => {
            video.__process.platform = "linux";
            video.__which.sync = sinon.stub().returns(null);
            expect(() => video.configure())
                .to.throw("not found: avconv or ffmpeg");
        });

        chunk("throws error if os isn't supported", () => {
            video.__process.platform = "macos";
            expect(() => video.configure())
                .to.throw("isn't supported on platform 'macos'");
        });
    });

    test(".start()", () => {

        chunk("skipped if video recording is launched already", () => {
            video.isRunning = true;
            video.start();
            expect(video._process).to.not.exist;
        });

        chunk("throws if video recorder isn't configured", () => {
            delete video._recordOpts;
            expect(() => video.start()).to.throw("isn't configured");
        });

        chunk("starts video recording", () => {
            video._recordOpts = [];
            video.start();
            expect(video.__spawn.calledOnce).to.be.true;
            expect(video._process).to.be.true;
            expect(video.isRunning).to.be.true;
        });
    });

    test(".stop()", () => {

        beforeChunk(() => {
            video.isRunning = true;
            video._process = {};
        })

        chunk("skipped if video recording isn't launched yet", () => {
            video.isRunning = false;
            expect(video.stop()).to.not.exist;
        });

        chunk("stops video recording", async () => {
            video._process.on = sinon.spy((ev, cb) => {
                if (ev === "exit") cb();
            });
            await expect(video.stop()).to.be.fulfilled;
            expect(video._process.on.calledTwice).to.be.true;
        });

        chunk("throws error if recording process was failed", async () => {
            video._process.on = sinon.spy((ev, cb) => {
                if (ev === "error") cb(new Error("process error"));
            });
            await expect(video.stop()).to.be.rejectedWith("process error");
            expect(video._process.on.calledTwice).to.be.true;
        });

        chunk("throws error if recording process has failed exit code", async () => {
            video._process.on = sinon.spy();
            video._process.kill = sinon.stub().returns(false);
            await expect(video.stop()).to.be.rejectedWith("Oops! Can't kill");
            expect(video._process.kill.calledOnce).to.be.true;
        });
    });
});
