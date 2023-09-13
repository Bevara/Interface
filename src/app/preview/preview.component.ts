import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Library } from '../services/libraries.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements AfterViewInit {

  html = '';

  @ViewChild('contentScript') contentScript: ElementRef | undefined;
  @ViewChild('contentTag') contentTag: ElementRef | undefined;
  @ViewChild('connected') connectedTab: ElementRef | undefined;
  @ViewChild('preview_elt') preview_elt: ElementRef | undefined;
  
  tabEvent: EventEmitter<MatTabChangeEvent> = new EventEmitter<MatTabChangeEvent>();

  constructor(private renderer: Renderer2,
    public accessorsService: AccessorsService) { }

  updateView() {
    if (this.contentScript) {
      if (this.accessorsService.isScript) {
        const player = document.createElement("script");
        player.innerHTML = this.accessorsService.html_code;

        this.renderer.appendChild(this.contentScript.nativeElement, player);
      } else if (this.contentTag) {
        const player = document.createElement("div");
        player.innerHTML = this.accessorsService.html_code;

        this.renderer.appendChild(this.contentTag.nativeElement, player);
        /*setTimeout(() => {
          this.waitForEnd();
        }, 5000);*/
      }
    }
  }

  async waitForEnd(){
    const preview_elt = document.getElementById(this.accessorsService.id) as any;

    if (preview_elt) {
      const decoding_promise = await preview_elt.decodingPromise;
      console.log(decoding_promise);
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
}
