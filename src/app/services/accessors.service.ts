import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { vscode } from "../utilities/vscode";
import { LibrariesService, JSON_Libraries } from './libraries.service';
import { TagsService } from './tags.service';
import { environment } from './../../environments/environment';
import { OptionsService } from './options.service';
import { Tag } from './tags.service';
import { LogsService } from './logs.service';
import { MediainfoService } from './mediainfo.service';
import { NGXLogger } from "ngx-logger";
import { debug } from '../debug';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AccessorsService {
  private _src = environment.src;
  private _dataUrl: string | null = null;
  public not_supported = false;
  public filename = "";
  public isEmpty = false;
  private _solver = "solver_1";
  private _is_vscode = environment.vscode;
  public showModalNeedPreserve = false;
  public showModalNeedLogin = false;
  public showModalAdd = false;
  public showModalUpdating = false;
  public updatingProgress = 0;
  public showModalUpdateAvailable = false;
  public newAccessorAdded = new EventEmitter<string>();
  public releaseList = new EventEmitter<string[]>();
  public repoExist = false;
  public templateExist = false;
  public forkExist = false;

  source_option: 'test_sequence' | 'url' | 'local' = 'test_sequence';

  constructor(
    private http: HttpClient,
    private _libs: LibrariesService,
    private _tags: TagsService,
    private _options: OptionsService,
    private _logs: LogsService,
    private _mediainfo: MediainfoService,
    private _auth: AuthService
    //private logger: NGXLogger
  ) {
    //this.logger.error("Your log message goes here");

    // Handle messages from the extension
    window.addEventListener('message', async e => {
      const { type, body, requestId } = e.data;
      switch (type) {
        case 'init':
          {
            if (body.untitled) {
              console.log("todo : init untitled");
              //editor.initUntitled();
              this.isEmpty = true;
            } else {
              //await editor.setData(body.uri.path, body.value, body.scripts, body.scriptsDirectory);
              this._src = body.uri.path;

              if (this._dataUrl) {
                URL.revokeObjectURL(this._dataUrl);
                this._dataUrl = null;
              }
              this.options.vsCodeScriptDirectory = body.scriptsDirectory;
              const blob = new Blob([body.value]);
              this._dataUrl = URL.createObjectURL(blob);
            }
            if (this._dataUrl) {
              this.initFilterAndInfo(this._dataUrl, body.filter_list);
            } else {
              this.initFilterAndInfo(this._src, body.filter_list);
            }

            return;
          }
        case 'getFileData':
          {
            console.log("getFileData()");
            return;
          }
        case 'wasmReady':
          {
            this.libs.isReady = true;
            this.libs.readyEvent.emit();
            return;
          }
        case 'updateProfile':
          {
            this._auth.account = body.account;
            this._auth.githubUser = body.github;
            this._auth.hasGit = body.hasGit;
            return;
          }
        case 'newAccessor':
        case 'refreshList':
          {
            this.not_supported = false;
            if (this._dataUrl && body.filter_list) {
              this.initFilterAndInfo(this._dataUrl, body.filter_list);
            }
            this.newAccessorAdded.emit(body.status);
            return;
          }
        case 'UpdateAvailable':
          {
            this.showModalUpdateAvailable = true;
            return;
          }
        case 'releaseList':
          {
            this.releaseList.emit(body.releases);
            return;
          }
        case 'updatingList':
          {
            if (body.end == true) {
              this.showModalUpdating = false;
            } else {
              this.showModalUpdating = true;
              this.updatingProgress = Math.round(100 * body.counter / body.total);
            }
            return;
          }
        case 'repoExist':
          {
            if (body.isTemplate) {
              this.templateExist = body.repoExist;
            } else {
              this.repoExist = body.repoExist;
            }
            return;
          }
        case 'forkExist':
          {
            this.forkExist = body.forkExist;
            return;
          }
      }
    });

    if (this.is_vscode) {
      vscode.postMessage({ type: 'ready' });
    } else {
      this.http.get<JSON_Libraries>("assets/filter_list.json")
        .subscribe(libs => {
          this.initFilterAndInfo(this._src, libs);
        });
    }
  }

  get isReady() {
    return this.libs.isReady;
  }

  get libs() {
    return this._libs;
  }

  get tags() {
    return this._tags;
  }

  set tag(tag: Tag) {
    this._tags.tag = tag;
  }

  get tag() {
    return this._tags.tag;
  }

  get integration() {
    return this._tags.integration;
  }

  get options() {
    return this._options;
  }

  get logs() {
    return this._logs;
  }

  get is_vscode() {
    return this._is_vscode;
  }

  get scriptDirectoryUrl() {
    return this._options.scriptDirectoryUrl;
  }
  set scriptDirectoryUrl(value: string) {
    this._options.scriptDirectoryUrl = value;
  }

  includeTags(tag: Tag) {
    return this._tags.includeTags(tag);
  }

  toogleTags(tag: Tag) {
    return this._tags.toogleTags(tag);
  }

  setRecommended() {
    const ext = this.source_option == 'local'? this.filename.split('.').pop() : this._src.split('.').pop();
    this.libs.setRecommended(this._mediainfo.info, ext);
    this.tags.setRecommended(this._mediainfo.info, ext);

    if (this.libs._slctLibs.length == 0) {
      this.not_supported = true;
    }
  }

  public initFilterAndInfo(src: string, libs: any) {
    this.libs._allLibs = [];
    for (const filename in libs) {
      const lib = libs[filename];
      lib.url = environment.server_url + "/" + filename;
      lib.id = filename.replace('.wasm', '');
      this.libs._allLibs.push(lib);
    }

    this.libs.updateRecommended(libs);
    this.tags.updateRecommended(libs);

    this._mediainfo.initInfo(src);
    this._mediainfo.readyEvent.subscribe(() => {
      //Default libs
      this.setRecommended();

      if (!this.is_vscode) {
        this.libs.isReady = true;
        this.libs.readyEvent.emit();
      }

    });
  }

  public updateView(){
    this.libs.readyEvent.emit();
  }

  get src() {
    return this._src;
  }

  set src(value: string) {
    this._src = value;

    if (this.libs.isReady){
      this._mediainfo.initInfo(value);
    }
  }

  public get html_preview() {
    switch (this.tags.integration) {
      case 'ArtPlayer':
        return this.artplayer_template;
      case 'Script':
        return this.script_template;
      case 'Universal tags':
        return this.universal_template;
    }
    return "";
  }


  private get with_template() {
    return this.libs._slctLibs.map(x => x.id).join(";");
  }

  private get artplayer_template() {
    return `var art = new Artplayer({
      container: '.artplayer-app',
      url: '${this._src}',
      plugins: [
        ${this.tag == 'canvas' ? 'UniversalCanvas' : 'UniversalVideo'}({
          using: "solver_1",
          with: "${this.with_template}",
          scriptDirectory: "${this.options.scriptDirectoryUrl}",
        }),
        ],
      });
    `;
  }

  private get universal_template() {
    return `<${this.tag} is="${this.tags.is}" ${this.tag == 'canvas' ? 'data-url' : 'src'}="${this._src}" using="${this._solver}" with="${this.with_template}" ${this.options.optionsStr} ${this.logs.logsStr}>`;
  }

  private get script_template() {
    let template = `new MutationObserver(mutations => mutations.forEach(mutation => mutation.addedNodes.forEach(el => {`;

    if (this.tags.includeTags('img')) {
      template += `
      if (el instanceof HTMLImageElement)
        el.onerror = () => decode(el, false, false);`;
    }

    if (this.tags.includeTags('audio')) {
      template += `
      if (el instanceof HTMLAudioElement)
        el.onerror = () => decode(el, false, false);`;
    }

    if (this.tags.includeTags('video')) {
      template += `
      if (el instanceof HTMLVideoElement)
        el.onerror = () => decode(el, false, false);`;
    }

    template += `
  }))).observe(document.documentElement, {subtree: true, childList: true});`;

    return template;
  }

  public get isScript() {
    return this.tags.integration == 'Script' || this.tags.integration == 'ArtPlayer';
  }

  public get isTag() {
    return this.tags.integration == 'Universal tags';
  }


  public get html_code() {
    return `<${this.tag} is="${this.tags.is}" ${this.tag != 'canvas' ? "id=preview_tag" : ""} ${this.tag == 'canvas' ? 'data-url' : 'src'}="${this.is_vscode ? this._dataUrl : this._src}" using="solver_1" with="${this.with_template}" ${this.options.optionsStr} ${this.is_vscode && !this.options.script_directory ? 'script-directory="' + this.options.vsCodeScriptDirectory + '"' : ''} ${this.logs.logsStr} print="console" printErr="console" noCleanupOnExit=true >`;
  }

  public get id() {
    return this.tag == 'canvas' ? "canvas" : "preview_tag";
  }

  public get info() {
    return this._mediainfo.info;
  }

  updateLibraries() {
    vscode.postMessage({ type: 'updateList' });
  }
}
