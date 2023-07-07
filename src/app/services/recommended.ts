interface Recommended<TValue> {
    [id: string]: TValue;
}


export const recommended : Recommended<string[]> = {
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
}