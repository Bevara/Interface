import { Injectable } from '@angular/core';
import { OptionsService } from './options.service';
import { environment } from 'src/environments/environment';

export type Tag = 'img' | 'audio' | 'video' | 'canvas';
export type Integration = 'Universal tags' | 'Script' | 'ArtPlayer' | null;
export type Is = 'universal-canvas_1' | 'universal-img_1' | 'universal-audio_1' | 'universal-video_1';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private _tag: Tag = 'canvas';
  private _is: Is = 'universal-canvas_1';
  private _tags: Tag[] = [];
  private _integration: Integration = null;
  private _recommendedExt: any = {};

  constructor(
    private options: OptionsService
  ) { }

  setRecommended(info: any, ext: string | undefined) {

    this.integration = "Universal tags";

    const video = info.filter((x: any) => x["@type"] == "Video");
    if (video.length > 0) {
      this.tag = "canvas";
      return;
    }

    const img = info.filter((x: any) => x["@type"] == "Image");

    if (img.length > 0) {
      this.tag = "img";
      return;
    }

    const audio = info.filter((x: any) => x["@type"] == "Audio");

    if (audio.length > 0) {
      this.tag = "audio";
      return;
    }

    if (ext && ext in this._recommendedExt) {
      this.tag = this._recommendedExt[ext].tag;
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

  set is(value: Is) {
    this._is = value;
  }

  get tag() {
    return this._tag;
  }

  set tag(value: Tag) {
    this._tag = value;

    switch (value) {
      case "audio":
        this._is = "universal-audio_1";
        this.options.addOptions(['controls']);
        this.options.removeOptions(['out']);
        break;
      case "img":
        this._is = "universal-img_1";
        this.options.removeOptions(['controls']);
        break;
      case "video":
        this._is = "universal-video_1";
        this.options.addOptions(['controls']);
        this.options.removeOptions(['out']);
        break;
      case "canvas":
        this._is = "universal-canvas_1";
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

  public get tagScripts() {
    return environment.server_url + "/accessors/universal-" + this._tag + "_" + environment.tags_version + ".js";
  }

  updateRecommended(libs: any) {
    this._recommendedExt = {};
    for (const [key, value] of Object.entries(libs)) {
      const filter = value as any;
      if (filter.extension) {
        const exts = Object.keys(filter.extension);

        for (const ext of exts) {
          this._recommendedExt[ext] = { "tag": filter.extension[ext] };
        }
      }
    }
  }
}
