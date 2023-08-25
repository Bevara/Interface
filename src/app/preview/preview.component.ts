import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements AfterViewInit {

  html = '';

  @ViewChild('contentScript') contentScript: ElementRef | undefined;
  @ViewChild('contentTag') contentTag: ElementRef | undefined;
  @ViewChild('notConnected') notConnectedTab: ElementRef | undefined;
  @ViewChild('connected') connectedTab: ElementRef | undefined;
  @ViewChild('preview_elt') preview_elt: ElementRef | undefined;

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

  populateUnused(){
    if (this.notConnectedTab){
      const preview_elt = document.getElementById("canvas") as any;
      if (preview_elt){
        const props = preview_elt.properties(["registered","connected"]);
        console.log(props);
      }
    }
  }

  populateConnected(){
    
  }

  selectTab(changeEvent: MatTabChangeEvent) {
    switch (changeEvent.tab.textLabel) {
      case "Graph":
        this.populateConnected();
        break;
      case "Unused":
        this.populateUnused();
        break;
    }
  }
}
