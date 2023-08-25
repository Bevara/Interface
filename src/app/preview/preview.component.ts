import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

declare function show_reports(): void;
declare function show_graph(): void;
declare function disable_reports(): void;


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements AfterViewInit {

  html = '';

  @ViewChild('contentScript') contentScript: ElementRef | undefined;
  @ViewChild('contentTag') contentTag: ElementRef | undefined;

  constructor(private renderer: Renderer2,
    private accessorsService: AccessorsService) { }

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
    switch (changeEvent.tab.textLabel) {
      case "Report":
        show_reports();
        break;
      case "Graph":
        disable_reports();
        show_graph();
        break;
      default:
        disable_reports();
        break;
    }
  }
}
