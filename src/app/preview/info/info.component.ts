import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as _ from 'lodash';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone : true,
  imports:[MatExpansionModule, MatTableModule]
})
export class InfoComponent implements OnInit {
  tracks: string[] = [];
  trackInfo: { [key: string]: any } = {};

  displayedColumns: string[] = ["type", "desc"];

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

  populateInfos() {
    const info = this.accessorsService.info;
    this.tracks = [];
    this.trackInfo = {};

    for (const track of info) {
      const type = track["@type"];
      this.tracks.push(type);
      this.trackInfo[type] = Object.entries(track)
        .filter(x => x[0] != "@type")
        .filter(x => x[0] != "VideoCount")
        .filter(x => x[0] != "AudioCount")
        .filter(x => x[0] != "ImageCount")
        .filter(x => x[0] != "ID")
        .map(o => {
          function isPlain(val: any) {
            return (typeof val === 'undefined' || typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number' || Array.isArray(val));
          }
          const value = isPlain(o[1]) ? o[1] : JSON.stringify(o[1]);

          return { type: o[0], desc: value };
        });

        console.log(this.trackInfo);
    }
  }
}
