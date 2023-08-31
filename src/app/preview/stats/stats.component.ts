import { Component, EventEmitter, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface FilterStats {
  [key: string]: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})

export class StatsComponent  {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;
  @Input() universal_elt = "";

  interval : string | number | NodeJS.Timeout | undefined = undefined;
  connected: string[] = [];
  to_refresh: string[] = [];
  filters_contents: FilterStats = {};

  ngOnInit(): void {
    if (this.tabEvent) {
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Stats") {
          this.populateStats();
        }else{
          clearInterval(this.interval);
        }
      });
    }
  }

  populateStats() {
    const preview_elt = document.getElementById(this.universal_elt) as any;
    if (preview_elt) {
      const props = preview_elt.properties(["connected"]);

      if (props && props["connected"]) {
        this.connected = props["connected"];
      }
    }
  }

  onOpen(f: string) {
    this.to_refresh.push(f);
    const preview_elt = document.getElementById(this.universal_elt) as any;
    if (!this.interval && preview_elt){
      this.interval = setInterval(() => {
        const props = preview_elt.properties([{"stats":this.to_refresh}]);
        if (props && props["stats"]) {
          this.filters_contents = props["stats"];
        }
      }, 1000);
    }
  }

  onClose(f: string) {
    const index = this.to_refresh.indexOf(f, 0);
    if (index > -1) {
      this.to_refresh.splice(index, 1);
    }

    if (this.to_refresh.length == 0){
      clearInterval(this.interval);
    }
  }
}
