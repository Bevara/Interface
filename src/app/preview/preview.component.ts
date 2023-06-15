import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit  {
  
  html:string ='<video src="https://bevara.ddns.net/test-signals/ogv/Big_Buck_Bunny_Trailer_400p.ogv" controls></video>';

  @ViewChild('content') content: ElementRef | undefined;
  
  constructor(private renderer: Renderer2) { }
  
  ngAfterViewInit(): void {
    if(this.content){     
      var player= document.createElement("script");
      player.innerHTML=`
      var art = new Artplayer({
        container: '.artplayer-app',
        url: 'https://bevara.ddns.net/test-signals/mpeg1/medical_demo.ts',
        autoSize: true,
        fullscreen: true,
        fullscreenWeb: true,
        plugins: [
          UniversalVideo({
            using: "solver",
            with: "m2psdmx;rfmpgvid;ffmpeg;mp4mx;rfnalu",
            scriptDirectory: "https://bevara.ddns.net/accessors/"
          }),
        ],
      });
      
      `;
    
      this.renderer.appendChild(this.content.nativeElement, player);
    }
  }

  loadScript() {
    var artplayer= document.createElement("script");
    artplayer.src="https://bevara.ddns.net/accessors/ArtPlayer/artplayer.js";
    artplayer.type = 'text/javascript';
    var universalVideo= document.createElement("script");
    universalVideo.src="https://bevara.ddns.net/accessors/ArtPlayer/universal-video.js";
    universalVideo.type = 'text/javascript';

    // append to head of document
    document.getElementsByTagName('head')[0]
    .appendChild(artplayer)
    .appendChild(universalVideo); 
  }

  
  ngOnInit(): void {
    this.loadScript();
  }
}
