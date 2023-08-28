import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit  {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;

  constructor(
    public accessorsService: AccessorsService) { 
      
    }

  ngOnInit(): void {
    if (this.tabEvent){
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Graph"){
          this.populateGraph();
        }
      });
    }
  }
  
  populateGraph() {
    const preview_elt = document.getElementById("canvas") as any;
    if (preview_elt) {
      const props = preview_elt.properties(["connected"]);

      if ( props && props["connected"]) {
        //this.unused = this.accessorsService.libs.getUnusedFromConnectedList(props["connected"]);
      }
    }
  }
}
