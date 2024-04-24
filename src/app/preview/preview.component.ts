import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LibrariesService, Library } from '../services/libraries.service';
import { Router } from '@angular/router';
import { MediainfoService } from '../services/mediainfo.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements AfterViewInit {
  decoding = false;
  error = false;
  spinner_color = "accent";
  html = '';
  tabIndex = 0;
  open_stat = "fin";

  @ViewChild('contentScript') contentScript: ElementRef | undefined;
  @ViewChild('contentTag') contentTag: ElementRef | undefined;
  @ViewChild('connected') connectedTab: ElementRef | undefined;
  @ViewChild('preview_elt') preview_elt: ElementRef | undefined;

  tabEvent: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();

  constructor(private renderer: Renderer2,
    public accessorsService: AccessorsService,
    public librariesService : LibrariesService,
    public infoService : MediainfoService,
    private router: Router
    ) { }


  updateView() {
    if (this.accessorsService.isEmpty){
      this.router.navigate(["/develop"]);
      return;
    }

    if (this.contentScript) {
      if (this.accessorsService.isScript) {
        const player = document.createElement("script");
        player.innerHTML = this.accessorsService.html_code;

        this.renderer.appendChild(this.contentScript.nativeElement, player);
      } else if (this.contentTag) {
        const player = document.createElement("div");
        player.innerHTML = this.accessorsService.html_code;

        this.renderer.appendChild(this.contentTag.nativeElement, player);
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
  }

  ngAfterViewInit(): void {
    if (this.accessorsService.isReady) {
      this.updateView();
    } else {
      this.accessorsService.readyEvent.subscribe(event => this.updateView());
    }
  }

  selectTab(changeEvent: MatTabChangeEvent) {
    this.tabEvent.emit(changeEvent);
  }

  changeTab(event:any){
    this.tabIndex = event.tabIndex;
    this.open_stat = event.key;
  }
}
