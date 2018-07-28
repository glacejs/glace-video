[![Build Status](https://travis-ci.org/glacejs/glace-video.svg?branch=master)](https://travis-ci.org/glacejs/glace-video)
 | [Source Code](https://github.com/glacejs/glace-video)
 | [Release Notes](tutorial-release-notes.html)

## GlaceJS Video plugin

Provides steps for [GlaceJS](https://glacejs.github.io/glace-core/) framework to capture video of executed tests.

## Features

- Video capture and video management.

## Requirements

- Installed `ffmpeg` or `avconv` on **unix** systems (on **windows** it will be installed with plugin).

## How to install

```
npm i glace-video
```

## How to use

```javascript
var glaceVideo = require("glace-video");
glaceVideo.Steps;
glaceVideo.config;
```

If plugin is used as a part of `GlaceJS` it will be loaded automatically.

## CLI options

- `--video` - Use video capture for launched autotests.
- `--video-save` - Save video for all tests (by default for failed only).

## API

- [config](GlaceConfig.html)
- [fixtures](global.html)
- [steps](VideoSteps.html)

## Test examples

See [integration tests](https://github.com/glacejs/glace-js/blob/master/tests/e2e/testVideo.js) in order to explore examples.

## Tests and quality

- Project tests report is <a href="allure-report/index.html" target="_blank">here</a>
- Code coverage report is <a href="tests-cover/lcov-report/index.html" target="_blank">here</a>
