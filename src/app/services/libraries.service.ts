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
  }, {
    id: "solver_1",
    name: "solver.wasm",
    filters: [],
    description: "",
    help: "",
    support: [],
    url: "https://bevara.ddns.net/accessors/solver_1.js",
  }];

  public _slctLibs: Library[] = [];
  public _allLibs: Library[] = [];

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
  }

  removeLibStr(value: string): void {
    const names = this._slctLibs.map(x => x.name);
    const index = names.indexOf(value);

    if (index >= 0) {
      this._slctLibs.splice(index, 1);

      //this.announcer.announce(`Removed ${value}`);
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

      //this.announcer.announce(`Removed ${library}`);
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

  setRecommendedFromExt(ext:string) {
    if (ext in recommendedExt){
      const libs = recommendedExt[ext].accessors;
      this._slctLibs = this._allLibs.filter(x => libs.includes(x.name));
    }
  }

  setRecommendedFromInfo(infos:any) {
    const libs :string []= [];
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
        libs.push(lib);
      }
    }

    this._slctLibs = this._allLibs.filter(x => libs.includes(x.name));
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

}
