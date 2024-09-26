import { EventEmitter, Injectable } from '@angular/core';
import MediaInfoFactory from 'mediainfo.js';
import type { MediaInfo, ReadChunkFunc } from 'mediainfo.js';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediainfoService {

  mi : MediaInfo<"JSON"> | null = null;
  json_info : any = {};
  supported_format = false;

  public readyEvent = new EventEmitter();

  async initInfo(src:string){
    function defaultLocateFile(path:string, prefix:string) {
      //return `${environment.server_url}/mediainfo/${path}`;
      return `https://unpkg.com/mediainfo.js@0.3.1/dist/MediaInfoModule.wasm`;
    }

    try{
      const response = await fetch(src);
      const blob = await response.blob();
      if (!this.mi){
        this.mi = await MediaInfoFactory({ format: 'JSON',locateFile: defaultLocateFile});
      }

      const getSize = () => blob.size;
      const readChunk: ReadChunkFunc = ((chunkSize, offset) =>{
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            if (event.target) {
              if (event.target.error){
                reject(event.target.error);
              }
              resolve(new Uint8Array(event.target.result as ArrayBuffer));
            }
          };
          reader.readAsArrayBuffer(blob.slice(offset, offset + chunkSize));
        });
      });
      this.json_info = JSON.parse(await this.mi.analyzeData(getSize, readChunk));
    }
    catch(e){
      console.log("Info failed at parsing file :"+src);
    }


    if (this.json_info.media && this.json_info.media.track.length != 1){
      // Information surely not revelant
      this.supported_format = true;
    }
    this.readyEvent.emit();
  }

  get info(){
    if ("media" in this.json_info && "track" in  this.json_info.media){
      return this.json_info.media.track;
    }

    return [];
  }

  get isJpeg(){
    const info = this.info;
    const img = info.filter((x :any) => x["@type"] == "Image");

    return img.length == 1 && "Format" in img[0] && img[0]["Format"] == "JPEG";
  }

  get isPng(){
    const info = this.info;
    const img = info.filter((x :any) => x["@type"] == "Image");

    return img.length == 1 && "Format" in img[0] && img[0]["Format"] == "PNG";
  }

  get hasAudio(){
    const info = this.info;
    const audio = info.filter((x :any) => x["@type"] == "Audio");
    return audio.length >= 1;
  }

  get hasVideo(){
    const info = this.info;
    const video = info.filter((x :any) => x["@type"] == "Audio");
    return video.length >= 1;
  }
}
