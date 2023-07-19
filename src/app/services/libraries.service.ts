import { LiveAnnouncer } from '@angular/cdk/a11y';
import { environment } from './../../environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { EventEmitter, Injectable } from '@angular/core';
import { recommendedFilters, recommendedTag } from '../utilities/recommended';
import { TagsService } from './tags.service';
import { HttpClient } from '@angular/common/http';

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
export class LibrariesService {

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

  setRecommended(src:string) {
    let fileExt = src.split('.').pop();
    if (fileExt) {
      fileExt = fileExt.toLowerCase();
      const recommended_list = recommendedFilters[fileExt];
      if (recommended_list) {
        this._slctLibs = this._allLibs.filter(x => recommended_list.includes(x.name));
      }
    }
  }

  get remain() {
    return this._allLibs.filter(x => !this._slctLibs.includes(x));
  }
}
