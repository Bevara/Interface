import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';
import MediaInfoFactory from 'mediainfo.js';
import type { ReadChunkFunc } from 'mediainfo.js';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  mediaInfo = [];

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
    this.mediaInfo = this.accessorsService.info;
  }
}
