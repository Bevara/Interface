import {UniversalImage} from "./UImage";

if (!customElements.get('universal-img')) {
    customElements.define('universal-img', UniversalImage, { extends: 'img' });
}

import {UniversalAudio} from "./UAudio";

if (!customElements.get('universal-audio')) {
    customElements.define('universal-audio', UniversalAudio, { extends: 'audio' });
}


import {UniversalVideo} from "./UVideo";

if (!customElements.get('universal-video')) {
    customElements.define('universal-video', UniversalVideo, { extends: 'video' });
}

import {UniversalCanvas} from "./UCanvas";

if (!customElements.get('universal-canvas')) {
    customElements.define('universal-canvas', UniversalCanvas, {extends: 'canvas' });
}