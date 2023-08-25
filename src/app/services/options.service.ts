import { Injectable } from '@angular/core';
import {debug} from '../utilities/debug';

export type Option = 'use-cache' | 'use-workers' | 'use-webcodecs' | 'data-autoplay' | 'script-directory' | 'controls';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private _options: Option[] = ['script-directory'];
  private _scriptDirectoryUrl = debug? "http://localhost:8081/" : "https://bevara.ddns.net/accessors/";

  constructor() { }

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

  get scriptDirectoryUrl() {
    return this._scriptDirectoryUrl;
  }

  set scriptDirectoryUrl(value: string) {
    this._scriptDirectoryUrl = value;
  }

  public includes(option:Option){
    return this._options.includes(option);
  }
}
