import { Injectable } from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Library {
  name: string;
}

export type Option = 'use-cache' | 'use-workers' | 'use-webcodecs' ;
export type Tag = 'img' | 'audio' | 'video' | 'canvas';
export type Integration = 'Universal tags' | 'Script';
export type Is = 'universal-canvas' | 'universal-img' | 'universal-audio' | 'universal-video';


@Injectable({
  providedIn: 'root'
})

export class AccessorsService {
  private _libraries: Library[] = [{name: 'avidmx'}, {name: 'xvid'}, {name: 'libmad'}, {name: 'rfmpgvid'}];
  private _options : Option[]=['use-cache'];
  private _tag : Tag= 'canvas';
  private _integration : Integration = 'Universal tags';
  private _is : Is = 'universal-canvas';
  
    
  announcer = inject(LiveAnnouncer);

  constructor() { }

  addLibrary(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this._libraries.push({name: value});
    }

    event.chipInput!.clear();
  }

  removeLibrary(library: Library): void {
    const index = this._libraries.indexOf(library);

    if (index >= 0) {
      this._libraries.splice(index, 1);

      this.announcer.announce(`Removed ${library}`);
    }
  }

  editLibrary(library: Library, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.removeLibrary(library);
      return;
    }

    const index = this._libraries.indexOf(library);
    if (index >= 0) {
      this._libraries[index].name = value;
    }
  }

  dropLibrary(event: CdkDragDrop<Library[]>) {
    moveItemInArray(this._libraries, event.previousIndex, event.currentIndex);
  }

  set options(options : Option[]){
    this._options = options
  }

  get options(){
    return this._options;
  }

  get libraries(){
    return this._libraries;
  }

  public get html_preview(){
    return `<${this._tag} is="${this._is}" data-url="https://bevara.ddns.net/test-signals/mpeg2/video_mpeg2.mp4" using="solver" with="${this._libraries.map(x=> x.name).join(";")}" ${this._options.join(" ")} data-autoplay=true controls  connections>`;
  }

  public set html_preview(html){
    
  }
}
