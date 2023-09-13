import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';

import { graphviz }  from 'd3-graphviz';

//import * as d3 from 'd3';

interface node {
  index: number;
  name: string;
  group: number;
}

interface link {
  source: node;
  target: node;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnInit {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;
  @Input() universal_elt = "";

  //private color = d3.scaleOrdinal(d3.schemeCategory10);

  constructor(
    public accessorsService: AccessorsService) {

  }

  ngOnInit(): void {
    if (this.tabEvent) {
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Graph") {
          this.populateGraph();
        }
      });
    }
  }

  populateGraph() {
    let width = 800;
    const preview_elt = document.getElementById(this.universal_elt) as any;

    const graph_div = document.getElementById("graph_placeholder") as any;

    if( graph_div && graph_div.clientWidth){
      width = graph_div.clientWidth;
    }
    
    if (preview_elt) {
      const props = preview_elt.properties(["graph"]);
      if (props && props["graph"]) {
        const graph = props["graph"];
        const links = graph.links
                      .map((x: any) => x.source.split(":")[0] + " -> " + x.target.split(":")[0])
                      .join(";");
        console.log("links :" + links);
        graphviz('#graph_placeholder')
        .width(width)
        .height(140)
        .fit(false)
        .engine('dot')
        .dot(`digraph {
          rankdir=LR
          bgcolor="transparent"
          node [fillcolor=DodgerBlue, fontcolor=white, style=filled]
          ${links}
        }`)
        .render();
      }
    }
  }
}
