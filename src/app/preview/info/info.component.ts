import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  tracks:string[] = [];
  trackInfo : { [key: string]: any } = {};

  displayedColumns: string[] = ["type","desc"];

  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;

  constructor(
    private accessorsService: AccessorsService) {

  }
  
  ngOnInit(): void {
    if (this.tabEvent) {
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Media info") {
          this.populateInfos();
        }
      });
    }
  }

  async populateInfos() {
    const info = this.accessorsService.info;
    this.tracks = [];
    this.trackInfo = {};

    for(const track of info){
      const type = track["@type"];
      this.tracks.push(type);
      this.trackInfo[type] = Object.entries(track)
      .filter(x => x[0] != "@type")
      .filter(x => x[0] != "VideoCount")
      .filter(x => x[0] != "AudioCount")
      .filter(x => x[0] != "ImageCount")
      .filter(x => x[0] != "ID")
      .map(o => {
        return { type: o[0], desc: o[1] };
    });
    }
  }
}
