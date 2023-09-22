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

  public readyEvent = new EventEmitter();
  
  async initInfo(src:string){

    function defaultLocateFile(path:string, prefix:string) {
      return `${environment.server_url}/mediainfo/${path}`;
    }

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
    this.readyEvent.emit();
  }

  get info(){
    if ("media" in this.json_info && "track" in  this.json_info.media){
      return this.json_info.media.track;      
    }

    return {};
  }
}
