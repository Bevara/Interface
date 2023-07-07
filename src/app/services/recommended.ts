interface Recommended<TValue> {
    [id: string]: TValue;
}


export const recommended : Recommended<string[]> = {
    "mp4": [
        "avidmx",
        "xviddec",
        "libmad",
        "rfmpgvid",
        "ffmpeg"
    ]
}