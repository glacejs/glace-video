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
