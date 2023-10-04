import { Injectable } from '@angular/core';
import { OptionsService } from './options.service';
import {recommendedExt } from '../utilities/recommended';

export type Tag = 'img' | 'audio' | 'video' | 'canvas';
export type Integration = 'Universal tags' | 'Script' | 'ArtPlayer';
export type Is = 'universal-canvas' | 'universal-img' | 'universal-audio' | 'universal-video';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private _tag: Tag = 'canvas';
  private _is: Is = 'universal-canvas';
  private _tags: Tag[] = [];
  private _integration: Integration = 'ArtPlayer';

  constructor(
   private options: OptionsService 
  ) { }

  setRecommendedFromExt(ext:string) {
    if (ext in recommendedExt){
      this.tag = recommendedExt[ext].tag;
    }
  }

  setRecommendedFromInfo(info:any) {
    this.integration = "Universal tags";

    const video = info.filter((x :any) => x["@type"] == "Video");
    if(video.length > 0) {
      this.tag = "canvas";
      return;
    }

    const img = info.filter((x :any) => x["@type"] == "Image");

    if(img.length > 0) {
      this.tag = "img";
      return;
    }

    const audio = info.filter((x :any) => x["@type"] == "Audio");

    if(audio.length > 0) {
      this.tag = "audio";
      return;
    }
  }

  get integration() {
    return this._integration;
  }

  set integration(value: Integration) {
    this._integration = value;
  }
  
  get is() {
    return this._is;
  }

  set is(value : Is ) {
    this._is = value;
  }

  get tag() {
    return this._tag;
  }

  set tag(value : Tag ) {
    this._tag = value;

    switch (value) {
      case "audio":
        this._is = "universal-audio";
        this.options.addOptions(['controls']);
        this.options.removeOptions(['out']);
        break;
      case "img":
        this._is = "universal-img";
        this.options.removeOptions(['controls']);
        break;
      case "video":
        this._is = "universal-video";
        this.options.addOptions(['controls']);
        this.options.removeOptions(['out']);
        break;
      case "canvas":
        this._is = "universal-canvas";
        this.options.removeOptions(['use-cache', 'use-workers', 'controls', 'out']);
        break;
    }

    switch (value) {
      case "audio":
      case "img":
        if (this.integration == 'ArtPlayer')
          this.integration = "Universal tags";
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
}
