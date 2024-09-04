import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface FilterStats {
  [key: string]: any;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone:true,
  imports:[MatExpansionModule, MatTableModule]
})

export class StatsComponent implements OnInit {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;
  @Input() universal_elt = "";
  @Input() open_stat = "fin";

  interval: string | number | NodeJS.Timeout | undefined = undefined;
  connected: string[] = [];
  filters_contents: FilterStats = {};
  displayedColumns: string[] = ["type", "desc"];

  ngOnInit(): void {
    if (this.tabEvent) {
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Stats") {
          this.populateStats();
        } else {
          this.clearStats();
        }
      });
    }
  }

  async populateStats() {
    const preview_elt = document.getElementById(this.universal_elt) as any;
    if (preview_elt) {
      preview_elt.enable_reporting = true;

      const props = await preview_elt.properties(["connected"]);

      if (props && props["connected"]) {
        this.connected = props["connected"];
      }
    }

    this.interval = setInterval(async () => {
      const props = await preview_elt.properties(["stats"]);
      if (props && props["stats"]) {
        const stats = props["stats"];
        for (const k in stats) {
          const stat = stats[k];
          this.filters_contents[k] = Object.entries(stat)
            .map((o: any) => {
              return { type: o[0], desc: o[1] };
            });
        }

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
