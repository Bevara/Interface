
import {Tag} from '../services/tags.service';

interface Recommended<TValue> {
    [id: string]: TValue;
}

export const recommendedFilters : Recommended<string[]> = {
    "amr": [
        "rfamr",
        "ffmpeg"
    ],
    "aac": [
        "libfaad"
    ],
    "ac3": [
        "liba52"
    ],
    "avi": [
        "mp4mx",
        "avidmx",
        "xviddec",
        "libmad",
        "rfmpgvid",
        "rfnalu",
        "ffmpeg"
    ],
    "flac": [
        "rfflac",
        "ffmpeg"
    ],
    "jp2":[
        "pngenc",
        "rfimg",
        "j2kdec"
    ],
    "jpg":[
        "pngenc",
        "rfimg",
        "imgdec"
    ],
    "j2k":[
        "pngenc",
        "rfimg",
        "j2kdec"
    ],
    "jxl":[
        "pngenc",
        "rfjxl",
        "jxldec"
    ],
    "mp3": [
        "libmad"
    ],
    "mp4": [
        "avidmx",
        "xviddec",
        "libmad",
        "rfmpgvid",
        "ffmpeg"
    ],
    "mpg": [
        "m2psdmx",
        "rfmpgvid",
        "ffmpeg",
        "mp4mx",
        "rfnalu"
    ],
    "ogg": [
        "xiph"
    ],
    "ogv": [
        "xiph",
        "ffmpeg"
    ],
    "opus": [
        "xiph",
        "ffmpeg"
    ],
    "tif": [
        "ffmpeg",
        "pngenc"
    ],
    "ts": [
        "m2psdmx",
        "rfmpgvid",
        "ffmpeg",
        "mp4mx",
        "rfnalu"
    ],
    "wma": [
        "ffmpeg"
    ]
};

export const recommendedTag : Recommended<Tag> = {
    "amr": "audio",
    "aac": "audio",
    "ac3": "audio",
    "avi": "canvas",
    "flac": "audio",
    "jpg":"img",
    "jp2":"img",
    "j2k":"img",
    "jxl":"img",
    "mp3": "audio",
    "mp4": "canvas",
    "mpg": "canvas",
    "ogg": "audio",
    "opus": "audio",
    "ogv": "canvas",
    "tif": "img",
    "ts": "canvas",
    "wma": "audio"
};