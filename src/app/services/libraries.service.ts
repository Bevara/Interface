import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Injectable } from '@angular/core';
import { recommendedFilters, recommendedExt } from '../utilities/recommended';

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
}


export interface JSON_Libraries {
  [index: string]: Library;
}

@Injectable({
  providedIn: 'root'
})
export class LibrariesService {

  public using: Library[] = [{
    id: "solver_1",
    name: "solver.js",
    filters: [],
    description: "",
    help: "",
    support: [],
    url: "https://bevara.ddns.net/accessors/solver_1.wasm",
    sources:"https://bevara.ddns.net/sources/solver.accessor",
    filter_source : {},
    licence_required : false
  }, {
    id: "solver_1",
    name: "solver.wasm",
    filters: ["vout","aout","fout","fin","httpin","writeuf","writegen","wcdec","wcenc","webgrab","resample","reframer","compositor"],
    description: "",
    help: "",
    support: [],
    url: "https://bevara.ddns.net/accessors/solver_1.js",
    sources:"https://bevara.ddns.net/sources/solver.accessor",
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
    licence_required : false
  }];

  public _slctLibs: Library[] = [];
  public _allLibs: Library[] = [];
  public licence_required = false;

  //announcer = inject(LiveAnnouncer);

  constructor(
  ) {

  }

  addLibraryStr(value: string): void {
    if (value && !this.hasLibStr(value)) {
      const newlib = this._allLibs.find(x => x.name == value);
      if (newlib)
        this._slctLibs.push(newlib);
    }

    this.updateLicenceRequired();
  }

  updateLicenceRequired(){
    this.licence_required = this._slctLibs.some(x => x.licence_required == true);
  }

  removeLibStr(value: string): void {
    const names = this._slctLibs.map(x => x.name);
    const index = names.indexOf(value);

    if (index >= 0) {
      this._slctLibs.splice(index, 1);

      //this.announcer.announce(`Removed ${value}`);
    }
    this.updateLicenceRequired();
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
    this.licence_required = this._slctLibs.some(x => x.licence_required == true);
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
  }

  removeAll() {
    this._slctLibs = [];
  }

  setRecommended(infos:any, ext:string | undefined) {

    const libs = new Set<string>();
    console.log(infos);
    for (const lib of Object.keys(recommendedFilters)){
      let found = false;
      const identifiers = recommendedFilters[lib];
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

    if (ext && ext in recommendedExt){
      recommendedExt[ext].accessors.forEach((x:string) => libs.add(x));
    }



    this._slctLibs = this._allLibs.filter(x => libs.has(x.name));
    this.updateLicenceRequired();
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

}
