import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;

  constructor(
    private accessorsService: AccessorsService) {

  }
  
  ngOnInit(): void {
    if (this.tabEvent) {
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Stats") {
          this.populateInfos();
        }
      });
    }
  }

  populateInfos() {

  }
}
