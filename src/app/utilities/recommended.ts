
import {Tag} from '../services/tags.service';

interface Identifier {
    [id: string]: string[];
}

interface Recommended<TValue> {
    [id: string]: TValue;
}
export const recommendedExt : Recommended<any> = {
    "jxl":{
        accessors:["libjxl"],
        tag:"img"
    },
    "wav":{
        accessors:["rfpcm"],
        tag:"audio"
    },
    "ac3":{
        accessors:["liba52"],
        tag:"audio"
    },
    "mpg":{
        accessors:["ffmpeg-mpeg1"],
        tag:"canvas"
    }
};

export const recommendedFilters : Recommended<Identifier> = {
    "libfaad":{
        "Format" : ["AAC"] 
    },
    "rfamr":{
        "Format" : ["AMR"] 
    },
    "liba52": {
        "Format" : ["AC-3"]
    },
    "libjpeg": {
        "Format" : ["JPEG"]
    },
    "libpng": {
        "Format" : ["PNG"]
    },
    "openjpeg": {
        "Format" : ["JPEG 2000"]
    },
    "qdbmp": {
        "Format" : ["RGB"]
    },
    "ffmpeg-mpeg1": {
        "Format" : ["MPEG Video", "MPEG-PS"]
    },
    "ffmpeg-flac": {
        "Format" : ["FLAC"]
    },
    "rfpcm": {
        "Format" : ["PCM"]
    }
    /*,
    "avi": [
        "mp4mx",
        "avidmx",
        "xviddec",
        "libmad",
        "rfmpgvid",
        "rfnalu",
        "ffmpeg"
    ],
    "bmp": [
        "bmpfull",
        "pngenc"
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
        "libjxl"
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
    ]*/
};