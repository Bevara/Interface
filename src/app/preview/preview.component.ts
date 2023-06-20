import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AccessorsService } from '../services/accessors.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit  {
  
  html:string ='<video src="https://bevara.ddns.net/test-signals/ogv/Big_Buck_Bunny_Trailer_400p.ogv" controls></video>';

  @ViewChild('content') content: ElementRef | undefined;
  
  constructor(private renderer: Renderer2,
    private accessorsService : AccessorsService) { }
  
  ngAfterViewInit(): void {
    if(this.content){     
      var player= document.createElement("script");
      player.innerHTML=this.accessorsService.html_code;
    
      this.renderer.appendChild(this.content.nativeElement, player);
    }
  }
  
  ngOnInit(): void {
  }
}
