import { Injectable } from '@angular/core';
import {debug} from '../debug';
import { LibrariesService } from './libraries.service';
import { MediainfoService } from './mediainfo.service';

export type Option = 'use-cache' | 'use-workers' | 'use-webcodecs' | 'data-autoplay' | 'script-directory' | 'controls' | 'out';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private _options: Option[] = ['script-directory'];
  private _scriptDirectoryUrl = debug? "http://localhost:8081/" : "https://bevara.ddns.net/accessors/";
  private _out = "rgba";

  constructor(
    private librariesService : LibrariesService,
    private mediaInfoService : MediainfoService
  ) { }

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
    return this._options.map(x => {
      switch (x){
        case 'script-directory':
          return 'script-directory="' + this._scriptDirectoryUrl + "\"";

        case 'out':
          return 'out="' + this._out + "\"";

        default:
          return x;

      }      
    }).join(" ");
  }

  get scriptDirectoryUrl() {
    return this._scriptDirectoryUrl;
  }

  set scriptDirectoryUrl(value: string) {
    this._scriptDirectoryUrl = value;
  }

  public includes(option:Option){
    return this._options.includes(option);
  }

  get availableOutputs(){
    const defaultOut = ["rgba", "rgb"];

    if (!this.mediaInfoService.isJpeg){
      defaultOut.push("jpeg");
    }

    if (!this.mediaInfoService.isPng){
      defaultOut.push("png");
    }

    return defaultOut;
  }

  get output(){
    return this._out;
  }
  
  set output(out : string){
    //Remove previous option
    switch(this._out){
      case "png":
        this.librariesService.removeLibStr("libpng");
        break;
      case "jpeg":
        this.librariesService.removeLibStr("libjpeg");
        break;
    }

    //Add new option
    switch(out){
      case "png":
        this.librariesService.addLibraryStr("libpng");
        break;
      case "jpeg":
        this.librariesService.addLibraryStr("libjpeg");
        break;
    }
    this._out = out;
  }
}
