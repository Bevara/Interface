import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { vscode } from "../utilities/vscode";
export type MediaSupport = 'image' | 'audio' | 'video';


export interface Library {
  id: string;
  name: string;
  description: string;
  filters: string[],
  help: string;
  support: MediaSupport[];
  url: string;
  sources: string;
  filter_source : { [key: string]: string; };
  licence_required : boolean;
  binaries : string,
  imported : boolean,
  owner : string,
  repo : string
}


export interface JSON_Libraries {
  [index: string]: Library;
}

interface Identifier {
  [id: string]: string[];
}

interface Recommended<TValue> {
  [id: string]: TValue;
}

@Injectable({
  providedIn: 'root'
})
export class LibrariesService {
  public isReady = false;
  public readyEvent = new EventEmitter();
  private recommendedFilters : Recommended<Identifier> = {};
  private recommendedExt : Recommended<any> = {};

  public using: Library[] = [{
    id: "solver_1",
    name: "solver_1.js",
    filters: [],
    description: "",
    help: "",
    support: [],
    url: "../accessors/solver_1.wasm",
    sources:"https://api.github.com/repos/Bevara/solver/zipball/1",
    filter_source : {},
    licence_required : false,
    binaries:"183214313",
    imported : false,
    owner : "Bevara",
    repo : "solver"
  }, {
    id: "solver_1",
    name: "solver_1.wasm",
    filters: ["vout","aout","fout","fin","httpin","writeuf","writegen","wcdec","wcenc","webgrab","resample","reframer","compositor"],
    description: "",
    help: "",
    support: [],
    url: "../accessors/solver_1.js",
    sources:"https://api.github.com/repos/Bevara/solver/zipball/1",
    filter_source:{
        "vout" : "out_video.c",
        "aout" : "out_audio.c",
        "fout" : "out_file.c",
        "fin" : "in_file.c",
        "httpin" : "in_http.c",
        "writeuf" : "write_generic.c",
        "writegen" : "write_generic.c",
        "wcdec" : "dec_webcodec.c",
        "wcenc" : "enc_webcodec.c",
        "webgrab" : "avin_web.c",
        "resample" : "resample_audio.c",
        "reframer" : "reframer.c",
        "compositor" : "compositor.c"
    },
    licence_required : false,
    binaries:"183214312",
    imported : false,
    owner : "Bevara",
    repo : "solver"
  }];

  public _slctLibs: Library[] = [];
  public _allLibs: Library[] = [];
  public licence_required = false;

  _binaries: {
    [key:string]: string
  } = {};


  addLibraryStr(value: string): void {
    if (value && !this.hasLibStr(value)) {
      const newlib = this._allLibs.find(x => x.name == value);
      if (newlib)
        this._slctLibs.push(newlib);
    }

    this.updateService();
  }

  addLibraryId(value: string): void {
    if (value && !this.hasLibStr(value)) {
      const newlib = this._allLibs.find(x => x.id == value);
      if (newlib)
        this._slctLibs.push(newlib);
    }

    this.updateService();
  }


  updateService(){
    this.licence_required = this._slctLibs.some(x => x.licence_required == true);
    if (environment.vscode) {
      vscode.postMessage({ type: 'getWasms', libs: this._slctLibs.map(x => x.id)});
    }else if (this.isReady){
      this.readyEvent.emit();
    }
  }

  removeLibStr(value: string): void {
    const names = this._slctLibs.map(x => x.name);
    const index = names.indexOf(value);

    if (index >= 0) {
      this._slctLibs.splice(index, 1);

      //this.announcer.announce(`Removed ${value}`);
    }
    this.updateService();
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

      //this.announcer.announce(`Removed ${library}`);
    }
    this.updateService();
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


  get libraries() {
    return this._slctLibs;
  }

  get all() {
    return this._allLibs;
  }

  addAll() {
    this._slctLibs = [...this._allLibs];
    this.updateService();
  }

  removeAll() {
    this._slctLibs = [];
    this.updateService();
  }

  setRecommended(infos:any, ext:string | undefined) {

    const libs = new Set<string>();
    console.log(infos);
    for (const lib of Object.keys(this.recommendedFilters)){
      let found = false;
      const identifiers = this.recommendedFilters[lib];
      for (const info of infos){
        const match_id = Object.keys(identifiers);
        const match_info = Object.keys(info).filter((x:string) => match_id.includes(x) &&  identifiers[x].includes(info[x]));
        if (match_info.length >0){
          found = true;
          break;
        }
      }
      if (found){
        libs.add(lib);
      }
    }
    if (ext && ext in this.recommendedExt){
      this.recommendedExt[ext].accessors.forEach((x:string) => libs.add(x));
    }


    this._slctLibs = this._allLibs.filter(x => libs.has(x.name));
  }

  get remain() {
    return this._allLibs.filter(x => !this._slctLibs.includes(x));
  }

  getUnusedFromConnectedList(connected: string[]): Library[] {
    const reg_names = connected.map(x => x.split(":")[0]);
    const unused_filters = [...this._slctLibs];

    for (const reg of reg_names) {
      for (const unused of this._slctLibs) {
        if (unused.filters &&
          unused.filters.length > 0 &&
          unused.filters.includes(reg) &&
          unused_filters.includes(unused)
        ) {
          const index = unused_filters.indexOf(unused);
          const x = unused_filters.splice(index, 1);
        } else if (unused.name === reg &&
          unused_filters.includes(unused)) {
          const index = unused_filters.indexOf(unused);
          const x = unused_filters.splice(index, 1);
        }
      }
    }

    return unused_filters;
  }

  filter_source(filter : string):any{
    let accessor = this._allLibs.find(x => x.filter_source && filter in x.filter_source);

    if (!accessor){
      accessor = this.using.find(x => x.filter_source && filter in x.filter_source);
    }

    if (!accessor){
      return null;
    }

    return {accessor_url: accessor.sources, filter:accessor.filter_source[filter]};
  }

  removeFromList(library: Library){
    const index = this._allLibs.findIndex(x=> x.id == library.id);

    if (index >= 0) {
      this._allLibs.splice(index, 1);

      //this.announcer.announce(`Removed ${library}`);
    }
    this.updateService();
  }

  updateRecommended(libs:any){
    this.recommendedFilters = {};
    this.recommendedExt = {};
    for (const [key, value] of Object.entries(libs)) {
      const filter = value as any;
      if (filter.Format){
        this.recommendedFilters[filter.name] = {
          "Format" : filter.Format
        };
      }

      if (filter.extension){
        const exts = Object.keys(filter.extension);

        for (const ext of exts){
          if (!(ext in this.recommendedExt)){
            this.recommendedExt[ext] = {"accessors" : []};
          }

          this.recommendedExt[ext].accessors.push(filter.name);
        }
      }
    }
  }
}
