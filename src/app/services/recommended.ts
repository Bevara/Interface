
interface Recommended<TValue> {
    [id: string]: TValue;
}


export type Tag = 'img' | 'audio' | 'video' | 'canvas';

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
    "jp2":"img",
    "jxl":"img",
    "mp3": "audio",
    "mp4": "canvas",
    "mpg": "canvas",
    "ogg": "audio",
    "ogv": "canvas",
    "ts": "canvas",
    "wma": "audio"
};