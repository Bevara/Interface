import { Injectable } from '@angular/core';
import { recommendedFilters, recommendedTag } from '../utilities/recommended';
import { OptionsService } from './options.service';

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

  setRecommended(src:string) {
    let fileExt = src.split('.').pop();
    if (fileExt) {
      fileExt = fileExt.toLowerCase();

      const recommended_tag = recommendedTag[fileExt];
      if (recommended_tag) {
        this.tag = recommended_tag;
        this.integration = "Universal tags";
      }
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
        break;
      case "img":
        this._is = "universal-img";
        this.options.removeOptions(['controls']);
        break;
      case "video":
        this._is = "universal-video";
        this.options.addOptions(['controls']);
        break;
      case "canvas":
        this._is = "universal-canvas";
        this.options.removeOptions(['use-cache', 'use-workers', 'controls'])
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