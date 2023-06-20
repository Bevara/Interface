import { Injectable } from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export type Option = 'use-cache' | 'use-workers' | 'use-webcodecs' ;
export type Tag = 'img' | 'audio' | 'video' | 'canvas';
export type Integration = 'Universal tags' | 'Script';
export type Is = 'universal-canvas' | 'universal-img' | 'universal-audio' | 'universal-video';
export type MediaSupport = 'image' | 'audio' | 'video' ;

export interface Library {
  name: string;
  description: string;
  help:string;
  support:MediaSupport[];
}

const libs : Library[] = [{name: 'avidmx',description:'AVI demultiplexer', help:'This filter demultiplexes AVI files to produce media PIDs and frames.', support:["video", "audio"]}, 
{name: 'xvid',description:'XVid decoder', help:'This filter decodes MPEG-4 part 2 (and DivX) through libxvidcore library.', support:["video"]}, 
{name: 'maddec',description:'"MAD decoder', help:'This filter decodes MPEG 1/2 audio streams through libmad library.', support:["audio"]}, 
{name: 'rfmpgvid',description:'M1V/M2V/M4V reframer', help:'This filter parses MPEG-1/2 and MPEG-4 part 2 video files/data and outputs corresponding video PID and frames.\nNote: The filter uses negative CTS offsets: CTS is correct, but some frames may have DTS greater than CTS.', support:["video", "audio"]},
{name: 'ffdec',description:'FFMPEG decoder', help:'This filter decodes audio and video streams using FFMPEG.', support:["image","video", "audio"]}
]

@Injectable({
  providedIn: 'root'
})

export class AccessorsService {
  
  private _slctLibs: Library[] =  Object.assign([], libs);
  private _allLibs: Library[] = Object.assign([], libs);
  private _options : Option[]=['use-cache'];
  private _tag : Tag= 'canvas';
  private _integration : Integration = 'Universal tags';
  private _is : Is = 'universal-canvas';
  
  
  announcer = inject(LiveAnnouncer);

  constructor() { }

  addLibraryStr(value: string): void {
    if (value && !this.hasLibStr(value)) {
      this._slctLibs.push({name: value, description:'', help:'', support:[]});
    }
  }

  addLibraryAutoComplete(event: MatAutocompleteSelectedEvent): void {
    if ( event.option.value) {
      this._slctLibs.push({name: event.option.value, description:'', help:'', support:[]});
    }
  }

  removeLibStr(value: string): void {
    const names = this._slctLibs.map(x => x.name);
    const index = names.indexOf(value);

    if (index >= 0) {
      this._slctLibs.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  hasLibStr(value: string): boolean {
    if (value) {
      return this._slctLibs.map(x=>x.name).includes(value);
    }

    return false
  }

  removeLibrary(library: Library): void {
    const index = this._slctLibs.indexOf(library);

    if (index >= 0) {
      this._slctLibs.splice(index, 1);

      this.announcer.announce(`Removed ${library}`);
    }
  }

  editLibrary(library: Library, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.removeLibrary(library);
      return;
    }

    const index = this._slctLibs.indexOf(library);
    if (index >= 0) {
      this._slctLibs[index].name = value;
    }
  }

  dropLibrary(event: CdkDragDrop<Library[]>) {
    moveItemInArray(this._slctLibs, event.previousIndex, event.currentIndex);
  }

  set options(options : Option[]){
    this._options = options
  }

  get options(){
    return this._options;
  }

  get libraries(){
    return this._slctLibs;
  }

  get all(){
    return this._allLibs;
  }

  get remain(){
    return this._allLibs.filter(x => !this._slctLibs.includes(x));
  }

  public get html_preview(){
    return `<${this._tag} is="${this._is}" data-url="https://bevara.ddns.net/test-signals/mpeg2/video_mpeg2.mp4" using="solver" with="${this._slctLibs.map(x=> x.name).join(";")}" ${this._options.join(" ")} data-autoplay=true controls  connections>`;
  }

  public set html_preview(html){
    
  }
}
