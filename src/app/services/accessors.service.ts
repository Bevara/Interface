import { Injectable } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export type Option = 'use-cache' | 'use-workers' | 'use-webcodecs' | 'data-autoplay' | 'script-directory';
export type Tag = 'img' | 'audio' | 'video' | 'canvas';
export type Integration = 'Universal tags' | 'Script' | 'ArtPlayer';
export type Is = 'universal-canvas' | 'universal-img' | 'universal-audio' | 'universal-video';
export type MediaSupport = 'image' | 'audio' | 'video';

export interface Library {
  name: string;
  description: string;
  help: string;
  support: MediaSupport[];
  url:string;
}

const libs: Library[] = [{ name: 'avidmx', description: 'AVI demultiplexer', help: 'This filter demultiplexes AVI files to produce media PIDs and frames.', support: ["video", "audio"], url:"https://bevara.ddns.net/accessors/avidmx.wasm" },
{ name: 'xvid', description: 'XVid decoder', help: 'This filter decodes MPEG-4 part 2 (and DivX) through libxvidcore library.', support: ["video"], url:"https://bevara.ddns.net/accessors/xviddec.wasm" },
{ name: 'libmad', description: '"MAD decoder', help: 'This filter decodes MPEG 1/2 audio streams through libmad library.', support: ["audio"], url:"https://bevara.ddns.net/accessors/libmad.wasm" },
{ name: 'rfmpgvid', description: 'M1V/M2V/M4V reframer', help: 'This filter parses MPEG-1/2 and MPEG-4 part 2 video files/data and outputs corresponding video PID and frames.\nNote: The filter uses negative CTS offsets: CTS is correct, but some frames may have DTS greater than CTS.', support: ["video", "audio"], url:"https://bevara.ddns.net/accessors/rfmpgvid.wasm" },
{ name: 'ffmpeg', description: 'FFMPEG decoder', help: 'This filter decodes audio and video streams using FFMPEG.', support: ["image", "video", "audio"], url:"https://bevara.ddns.net/accessors/ffmpeg.wasm" }
]

@Injectable({
  providedIn: 'root'
})

export class AccessorsService {
  public using :Library[] = [{
    name: "solver.js",
    description : "",
    help :"",
    support:[],
    url:"https://bevara.ddns.net/accessors/solver.wasm",
  },{
    name: "solver.wasm",
    description : "",
    help :"",
    support:[],
    url:"https://bevara.ddns.net/accessors/solver.js",
  }];

  private _slctLibs: Library[] = Object.assign([], libs);
  private _allLibs: Library[] = Object.assign([], libs);
  private _options: Option[] = ['use-cache','script-directory'];
  private _scriptDirectoryUrl: String = "https://bevara.ddns.net/accessors/";
  private _tag: Tag = 'canvas';
  private _tags: Tag[] = [];
  private _integration: Integration = 'Universal tags';
  private _is: Is = 'universal-canvas';
  private _src: string = 'https://bevara.ddns.net/test-signals/mpeg2/video_mpeg2.mp4';


  announcer = inject(LiveAnnouncer);

  constructor() { }

  addLibraryStr(value: string): void {
    if (value && !this.hasLibStr(value)) {
      this._slctLibs.push({ name: value, description: '', help: '', support: [], url:"" });
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
      return this._slctLibs.map(x => x.name).includes(value);
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

  set options(options: Option[]) {
    this._options = options;
  }

  toogleOption(option: Option) {
    var index = this._options.indexOf(option);

    if (index === -1) {
      this._options.push(option);
    } else {
      this._options.splice(index, 1);
    }
  }

  get options() {
    return this._options;
  }

  get optionsStr() : string{
    return this._options.map(x=> x == 'script-directory'? 'script-directory="'+this._scriptDirectoryUrl+"\"" :x ).join(" ");
  }

  get libraries() {
    return this._slctLibs;
  }

  get all() {
    return this._allLibs;
  }

  get tag() {
    return this._tag;
  }

  set tag(value: Tag) {
    this._tag = value;

    switch (value) {
      case "audio":
        this._is = "universal-audio"
        break;
      case "img":
        this._is = "universal-img"
        break;
      case "video":
        this._is = "universal-video"
        break;
      case "canvas":
        this._is = "universal-canvas"
        break;
    }

    switch (value) {
      case "audio":
      case "img":
        if (this._integration == 'ArtPlayer')
          this._integration = "Universal tags";
        break;
    }
  }

  toogleTags(tag : Tag){
    var index = this._tags.indexOf(tag);

    if (index === -1) {
      this._tags.push(tag);
    } else {
      this._tags.splice(index, 1);
    }
  }

  includeTags(tag : Tag){
    return this._tags.indexOf(tag) !== -1;
  }

  get src() {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
  }

  get integration() {
    return this._integration;
  }

  set integration(value: Integration) {
    this._integration = value;
  }

  get scriptDirectoryUrl() {
    return this._scriptDirectoryUrl;
  }

  set scriptDirectoryUrl(value: String) {
    this._scriptDirectoryUrl = value;
  }

  get remain() {
    return this._allLibs.filter(x => !this._slctLibs.includes(x));
  }

  public get html_preview() {
    const with_value = this._slctLibs.map(x => x.name).join(";");
    switch (this._integration) {
      case 'ArtPlayer':
        return this.artplayer_template;
      case 'Script':
        return this.script_template;
      case 'Universal tags':
        return this.universal_template;
    }
    return "";
  }

  public set html_preview(html) {

  }

  private get with_template(){
    return this._slctLibs.map(x => x.name).join(";");
  }

  private get artplayer_template(){
    const with_value = this._slctLibs.map(x => x.name).join(";");

    return `var art = new Artplayer({
      container: '.artplayer-app',
      url: '${this._src}',
      plugins: [
        ${this._tag == 'canvas'?'UniversalCanvas':'UniversalVideo'}({
          using: "solver",
          with: "${this.with_template}",
          scriptDirectory: "${this._scriptDirectoryUrl}",
        }),
        ],
      });
    `;
  }
  
  private get universal_template(){
    return `<${this._tag} is="${this._is}" ${this._tag == 'canvas' ? 'data-url' : 'src'}="${this._src}" using="solver" with="${this.with_template}" ${this.optionsStr} data-autoplay=true>`;
  }
  
  private get script_template(){
    let template = `new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(el => {`;

    if (this.includeTags('img')){
      template += `
      if (el instanceof HTMLImageElement)
        el.onerror = () => decode(el, false, false);`
    }

    if (this.includeTags('audio')){
      template += `
      if (el instanceof HTMLAudioElement)
        el.onerror = () => decode(el, false, false);`
    }

    if (this.includeTags('video')){
      template += `
      if (el instanceof HTMLVideoElement)
        el.onerror = () => decode(el, false, false);`
    }

    template +=`
  }))).observe(document.documentElement, {subtree: true, childList: true});`

    return template;
  }

  public get isScript() {
    return false;
  }

  public get html_code() {
   /* return `
    var art = new Artplayer({
      container: '.artplayer-app',
      url: 'https://bevara.ddns.net/test-signals/mpeg1/medical_demo.ts',
      autoSize: true,
      fullscreen: true,
      fullscreenWeb: true,
      plugins: [
        UniversalCanvas({
          using: "solver",
          with: "m2psdmx;rfmpgvid;ffmpeg;mp4mx;rfnalu",
          scriptDirectory: "https://bevara.ddns.net/accessors/"
        }),
      ],
    });
    `;*/

    return this.html_preview;
  }
}
