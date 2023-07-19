import { EventEmitter, Injectable } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { recommendedFilters, recommendedTag, Tag } from './recommended';
import { vscode } from "./vscode";
import { environment } from './../../environments/environment';

export type Option = 'use-cache' | 'use-workers' | 'use-webcodecs' | 'data-autoplay' | 'script-directory' | 'controls';
export type Integration = 'Universal tags' | 'Script' | 'ArtPlayer';
export type Is = 'universal-canvas' | 'universal-img' | 'universal-audio' | 'universal-video';
export type MediaSupport = 'image' | 'audio' | 'video';

export interface Library {
  id: string;
  name: string;
  description: string;
  help: string;
  support: MediaSupport[];
  url: string;
}
export interface JSON_Libraries {
  [index: string]: Library;
}

@Injectable({
  providedIn: 'root'
})

export class AccessorsService {
  public using: Library[] = [{
    id: "solver_1",
    name: "solver.js",
    description: "",
    help: "",
    support: [],
    url: "https://bevara.ddns.net/accessors/solver_1.wasm",
  }, {
    id: "solver_1",
    name: "solver.wasm",
    description: "",
    help: "",
    support: [],
    url: "https://bevara.ddns.net/accessors/solver_1.js",
  }];

  private _slctLibs: Library[] = [];
  private _allLibs: Library[] = [];
  private _options: Option[] = ['script-directory'];
  private _scriptDirectoryUrl: string = "https://bevara.ddns.net/accessors/";
  private _tag: Tag = 'canvas';
  private _tags: Tag[] = [];
  private _integration: Integration = 'ArtPlayer';
  private _is: Is = 'universal-canvas';
  private _src = 'https://bevara.ddns.net/test-signals/mpeg1/medical_demo.ts';
  private _dataUrl :string | null = null;
  public readyEvent = new EventEmitter();
  public isReady = false;

  announcer = inject(LiveAnnouncer);

  constructor(
    private http: HttpClient
  ) {

    // Handle messages from the extension
    window.addEventListener('message', async e => {
      const { type, body, requestId } = e.data;
      switch (type) {
        case 'init':
          {
            if (body.untitled) {
              console.log("todo : init untitled");
              //editor.initUntitled();
            } else {
              //await editor.setData(body.uri.path, body.value, body.scripts, body.scriptsDirectory);
              this._src = body.uri.path;
              this.setRecommended();

              if(this._dataUrl){
                URL.revokeObjectURL(this._dataUrl);
                this._dataUrl = null;
              }

              const blob = new Blob([body.value]);
              this._dataUrl = URL.createObjectURL(blob);
            }
            this.initFilterList();
            return;
          }
        case 'getFileData':
          {
            //const bevaraData = await editor.getBevaraData();
            //vscode.postMessage({ type: 'response', requestId, body: bevaraData });
            console.log("getFileData()");
            return;
          }
      }
    });

    if (environment.vscode){
      vscode.postMessage({ type: 'ready' });
    }else{
      this.initFilterList();
    }
  }

  private initFilterList(){
    this.http.get<JSON_Libraries>(environment.server_url + "filter_list.json")
      .subscribe(libs => {
        for (const filename in libs) {
          const lib = libs[filename];
          lib.url = environment.server_url + filename;
          lib.id = filename.replace('.wasm', '');
          this._allLibs.push(lib);
        }

        //Default libs
        this.setRecommended();
        this.isReady = true;
        this.readyEvent.emit();
      });
  }

  addLibraryStr(value: string): void {
    if (value && !this.hasLibStr(value)) {
      this._slctLibs.push({ id: "", name: value, description: '', help: '', support: [], url: "" });
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

    return false;
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

  get options() {
    return this._options;
  }

  hasOption(option: Option) {
    return this._options.indexOf(option) !== -1;
  }

  toogleOption(option: Option) {
    const index = this._options.indexOf(option);

    if (index === -1) {
      this._options.push(option);
    } else {
      this._options.splice(index, 1);
    }
  }

  addOptions(options: Option[]) {
    options.forEach(option => this.addOption(option));
  }

  addOption(option: Option) {
    if (!this.hasOption(option)) {
      this._options.push(option);
    }
  }

  removeOptions(options: Option[]) {
    options.forEach(option => this.removeOption(option));
  }

  removeOption(option: Option) {
    const index = this._options.indexOf(option);

    if (index !== -1) {
      this._options.splice(index, 1);
    }
  }

  get optionsStr(): string {
    return this._options.map(x => x == 'script-directory' ? 'script-directory="' + this._scriptDirectoryUrl + "\"" : x).join(" ");
  }

  get libraries() {
    return this._slctLibs;
  }

  get all() {
    return this._allLibs;
  }

  addAll() {
    this._slctLibs = [...this._allLibs];
  }

  removeAll() {
    this._slctLibs = [];
  }

  setRecommended() {
    const fileExt = this._src.split('.').pop();
    if (fileExt) {

      const recommended_list = recommendedFilters[fileExt];
      if (recommended_list) {
        this._slctLibs = this._allLibs.filter(x => recommended_list.includes(x.name));
      }

      const recommended_tag = recommendedTag[fileExt];
      if (recommended_tag) {
        this.tag = recommended_tag;
        this.integration = "Universal tags";
      }
    }
  }

  get tag() {
    return this._tag;
  }

  set tag(value: Tag) {
    this._tag = value;

    switch (value) {
      case "audio":
        this._is = "universal-audio";
        this.addOptions(['controls']);
        break;
      case "img":
        this._is = "universal-img";
        this.removeOptions(['controls']);
        break;
      case "video":
        this._is = "universal-video";
        this.addOptions(['controls']);
        break;
      case "canvas":
        this._is = "universal-canvas";
        this.removeOptions(['use-cache', 'use-workers', 'controls'])
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

  toogleTags(tag: Tag) {
    const index = this._tags.indexOf(tag);

    if (index === -1) {
      this._tags.push(tag);
    } else {
      this._tags.splice(index, 1);
    }
  }

  includeTags(tag: Tag) {
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

  set scriptDirectoryUrl(value: string) {
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

  private get with_template() {
    return this._slctLibs.map(x => x.id).join(";");
  }

  private get artplayer_template() {
    const with_value = this._slctLibs.map(x => x.name).join(";");

    return `var art = new Artplayer({
      container: '.artplayer-app',
      url: '${this._src}',
      plugins: [
        ${this._tag == 'canvas' ? 'UniversalCanvas' : 'UniversalVideo'}({
          using: "solver_1",
          with: "${this.with_template}",
          scriptDirectory: "${this._scriptDirectoryUrl}",
        }),
        ],
      });
    `;
  }

  private get universal_template() {
    return `<${this._tag} is="${this._is}" ${this._tag == 'canvas' ? 'data-url' : 'src'}="${this._src}" using="solver_1" with="${this.with_template}" ${this.optionsStr}>`;
  }

  private get script_template() {
    let template = `new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(el => {`;

    if (this.includeTags('img')) {
      template += `
      if (el instanceof HTMLImageElement)
        el.onerror = () => decode(el, false, false);`;
    }

    if (this.includeTags('audio')) {
      template += `
      if (el instanceof HTMLAudioElement)
        el.onerror = () => decode(el, false, false);`;
    }

    if (this.includeTags('video')) {
      template += `
      if (el instanceof HTMLVideoElement)
        el.onerror = () => decode(el, false, false);`;
    }

    template += `
  }))).observe(document.documentElement, {subtree: true, childList: true});`;

    return template;
  }

  public get isScript() {
    return this._integration != 'Universal tags';
  }

  public get html_code() {
    return `<${this._tag} is="${this._is}" ${this._tag == 'canvas' ? 'data-url' : 'src'}="${environment.vscode? this._dataUrl : this._src}" using="solver_1" with="${this.with_template}" ${this.optionsStr}>`;
  }
}
