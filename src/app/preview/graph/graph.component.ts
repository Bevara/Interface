import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';
import { vscode } from "../../utilities/vscode";
import {environment} from '../../../environments/environment';

import { graphviz } from 'd3-graphviz';
import * as d3 from 'd3';

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
  styleUrls: ['./graph.component.scss'],
  standalone: true,
  imports: []
})

export class GraphComponent implements OnInit {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;
  @Input() universal_elt = "";
  @Output() changeTab = new EventEmitter();

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

  interactive() {
    const self = this;
    let key = "";

    const tooltip = d3.select("#graph_placeholder")
      .append("div")
      .attr("id", "node_menu")
      .style("position", "absolute")
      .style("color", "black")
      .style("visibility", "hidden")
      .style('border', '.1px solid black')
      .style('background-color', '#F5F5F5');

    tooltip.append("rect")
      .attr("width", 300)
      .attr("height", 20)
      .text("View source")
      .on("click", function (d) {
        if(environment.vscode){
          const filter_source = self.accessorsService.libs.filter_source(key);
          vscode.postMessage({ type: 'explore', url: filter_source.accessor_url, filter: filter_source.filter});
        }
      })
      .on("mouseover", function (d) {
        d3.select(this).style("color", "blue");
      })
      .on("mouseout", function (d) {
        d3.select(this).style("color", "black");
      })
      .append("br");

    tooltip.append("rect")
      .attr("width", 300)
      .attr("height", 20)
      .text("View stats")
      .on("mouseover", function (d) {
        d3.select(this).style("color", "blue");
      })
      .on("mouseout", function (d) {
        d3.select(this).style("color", "black");
      })
      .on("click", function (d) {
        self.changeTab.emit({tabIndex:2, key:key});
      });

    const nodes = d3.selectAll('.node');
    nodes
      .on("mouseover", function (e, d: any) {
        const x = e.offsetX;
        const y = e.offsetY;

        d3.select('#node_menu')
          .style('position', 'absolute')
          .style('visibility', 'visible')
          .style('left', x + "px")
          .style('top', y + "px")
          .style('display', 'block');

        key = d.key;
        e.preventDefault();
      });
  }

  async populateGraph() {
    let width = 800;
    const preview_elt = document.getElementById(this.universal_elt) as any;

    const graph_div = document.getElementById("graph_placeholder") as any;

    if (graph_div && graph_div.clientWidth) {
      width = graph_div.clientWidth;
    }

    if (preview_elt) {
      const props = await preview_elt.properties(["graph"]);
      if (props && props["graph"]) {
        const graph = props["graph"];
        const links = graph.links
          .map((x: any) => x.source.split(":")[0] + " -> " + x.target.split(":")[0])
          .join(";");
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
          .render()
          .on("end", this.interactive.bind(this));
      }
    }
  }
}
