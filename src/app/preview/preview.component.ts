import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { LibrariesService, Library } from '../services/libraries.service';
import { MediainfoService } from '../services/mediainfo.service';
import { ModalComponent } from '../modal/modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { IntegrationComponent } from './integration/integration.component';
import { InfoComponent } from './info/info.component';
import { GraphComponent } from './graph/graph.component';
import { StatsComponent } from './stats/stats.component';
import { UnusedComponent } from './unused/unused.component';
import { OptionsComponent } from './options/options.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  standalone : true,
  imports : [ModalComponent, MatProgressSpinnerModule, MatCardModule, MatTabsModule, IntegrationComponent, OptionsComponent, InfoComponent, GraphComponent, StatsComponent, UnusedComponent]
})
export class PreviewComponent implements AfterViewInit {
  decoding = false;
  error = false;
  spinner_color = "accent";
  html = '';
  tabIndex = 0;
  open_stat = "fin";
  player : any = null;
  wait_for_click = false;

  @ViewChild('contentScript') contentScript: ElementRef | undefined;
  @ViewChild('contentTag') contentTag: ElementRef | undefined;
  @ViewChild('connected') connectedTab: ElementRef | undefined;
  @ViewChild('preview_elt') preview_elt: ElementRef | undefined;

  tabEvent: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();

  constructor(private renderer: Renderer2,
    public accessorsService: AccessorsService,
    public librariesService : LibrariesService,
    public infoService : MediainfoService
    ) { }


  insertHtml() {
    if (this.contentTag){
      if (this.player != null){
        this.renderer.removeChild(this.contentTag.nativeElement, this.player);
      }

      this.player = document.createElement("div");
      this.player.innerHTML = this.accessorsService.html_code;

      this.renderer.appendChild(this.contentTag.nativeElement, this.player);
      const preview_elt = document.getElementById(this.accessorsService.id) as any;

      if (this.accessorsService.tag == "canvas" || this.accessorsService.not_supported) return;

      //this.decoding = true;

      if (!preview_elt.decodingPromise){
        this.decoding = false;
        this.error =true;
        return;
      }

      // preview_elt.decodingPromise.then((src:any) => {
      //   this.decoding = false;
      //   if(!src){
      //     this.error =true;
      //   }
      // });
    }
  }

  updateView() {
    if (this.contentScript) {
      if (this.player != null){
        this.renderer.removeChild(this.contentScript.nativeElement, this.player);
      }

      if (this.accessorsService.isScript) {
        this.player = document.createElement("script");
        this.player.innerHTML = this.accessorsService.html_code;

        this.renderer.appendChild(this.contentScript.nativeElement, this.player);
      } else if (this.accessorsService.isTag ) {
        if (this.accessorsService.tag == "canvas"  && this.infoService.hasAudio){
          //For canvas, the user should click first on the screen
          this.wait_for_click = true;
          return;
        }

        this.insertHtml();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.accessorsService.isReady) {
      this.updateView();
    } else {
      this.accessorsService.libs.readyEvent.subscribe(event => this.updateView());
    }
  }

  selectTab(changeEvent: MatTabChangeEvent) {
    this.tabEvent.emit(changeEvent);
  }

  changeTab(event:any){
    this.tabIndex = event.tabIndex;
    this.open_stat = event.key;
  }

  showContent(){
    this.wait_for_click = false;
    this.insertHtml();
  }
}
