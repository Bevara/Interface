import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface FilterStats {
  [key: string]: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})

export class StatsComponent implements OnInit {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;
  @Input() universal_elt = "";

  interval : string | number | NodeJS.Timeout | undefined = undefined;
  connected: string[] = [];
  filters_contents: FilterStats = {};

  ngOnInit(): void {
    if (this.tabEvent) {
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Stats") {
          this.populateStats();
        }else{
          this.clearStats();
        }
      });
    }
  }

  populateStats() {
    const preview_elt = document.getElementById(this.universal_elt) as any;
    if (preview_elt) {
      preview_elt.enable_reporting = true;

      const props = preview_elt.properties(["connected"]);

      if (props && props["connected"]) {
        this.connected = props["connected"];
      }
    }
    
    this.interval = setInterval(() => {
      const props = preview_elt.properties(["stats"]);
      if (props && props["stats"]) {
        this.filters_contents = props["stats"];
      }
    }, 1000);

  }

  clearStats() {
    const preview_elt = document.getElementById(this.universal_elt) as any;
    if (preview_elt) {
      preview_elt.enable_reporting = false;
    }
    
    clearInterval(this.interval);
  }
}
