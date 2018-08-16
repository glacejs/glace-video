"use strict";

suite("fixtures", () => {

    scope("fxVideo", () => {
        var fake, $;
        var sandbox = sinon.createSandbox();
        var fxVideo = rewire("../../lib/fixtures/fxVideo");

        beforeChunk(() => {
            fake = {
                before: sinon.spy(),
                after: sinon.spy(),
                _before: sinon.spy(),
                _after: sinon.spy(),
                func: sinon.spy(),
            };
        });

        afterChunk(() => {
            sandbox.restore();
            fxVideo.__reset__();
        });

        test(".fxVideo()", () => {

            beforeChunk(() => {
                fxVideo.__set__("before", fake.before);
                fxVideo.__set__("after", fake.after);
                fxVideo.__set__("_before", fake._before);
                fxVideo.__set__("_after", fake._after);
            });

            chunk("in global context", () => {
                fxVideo(fake.func);
                expect(fake.func).to.be.calledOnce;
                expect(fake._before).to.be.calledOnce;
                expect(fake._after).to.be.calledOnce;
                expect(fake.before).to.be.calledOnce;
                expect(fake.after).to.be.calledOnce;
                expect(fake._before.args[0][0].opts).to.be.undefined;
            });

            chunk("in custom context", () => {
                fxVideo.bind({ name: "name", dir: "dir" })(fake.func);
                expect(fake.func).to.be.calledOnce;
                expect(fake._before).to.be.calledOnce;
                expect(fake._after).to.be.calledOnce;
                expect(fake.before).to.be.calledOnce;
                expect(fake.after).to.be.calledOnce;
                expect(fake._before.args[0][0].opts.name).to.be.equal("name");
                expect(fake._before.args[0][0].opts.dir).to.be.equal("dir");
            });
        });

        test("._before()", () => {
            var _before, ctx = {};

            beforeChunk(() => {
                _before = fxVideo.__get__("_before");
                $ = fxVideo.__get__("$");
                sandbox.stub($, "startVideo").returns(true);
            });

            chunk(async () => {
                await _before(ctx)();
                expect($.startVideo).to.be.calledOnce;
                expect(ctx.errNumBefore).to.be.equal(0);
                expect(ctx.isStarted).to.be.true;
            });
        });

        test("._after()", () => {
            var _after, ctx = {}, allure;

            beforeChunk(() => {
                _after = fxVideo.__get__("_after");
                $ = fxVideo.__get__("$");
                sandbox.stub($, "stopVideo");
                sandbox.stub($, "removeVideo");
                allure = {
                    attachVideo: sinon.spy(),
                };
                fxVideo.__set__("allure", allure);
            });

            chunk("skipped if video aren't captured", async () => {
                ctx.isStarted = false;
                await _after(ctx)();
                expect($.stopVideo).to.not.be.called;
            });

            chunk("stops video capture", async () => {
                ctx.isStarted = true;
                ctx.errNumBefore = 0;
                CONF.video.save = true;
                await _after(ctx)();
                expect($.stopVideo).to.be.calledOnce;
                expect($.removeVideo).to.not.be.called;
                expect(ctx.isStarted).to.be.false;
            });

            chunk("removes captured video", async () => {
                ctx.isStarted = true;
                ctx.errNumBefore = 0;
                CONF.video.save = false;
                await _after(ctx)();
                expect($.stopVideo).to.be.calledOnce;
                expect($.removeVideo).to.be.calledOnce;
                expect(ctx.isStarted).to.be.false;
            });
        });
    });
});
