import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccessorsService } from 'src/app/services/accessors.service';
import * as d3 from 'd3';

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

  private color = d3.scaleOrdinal(d3.schemeCategory10);

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
    const preview_elt = document.getElementById(this.universal_elt) as any;
    if (preview_elt) {
      const props = preview_elt.properties(["graph"]);

      if (props && props["graph"]) {
        const graph = props["graph"];
        const nodes = graph.nodes.map((x: node) => {
          x.index = graph.nodes.indexOf(x);
          return x;
        });
        const links = graph.links.map((x: any) => {
          x.source = nodes.find((n: node) => n.name === x.source);
          x.target = nodes.find((n: node) => n.name === x.target);
          return x;
        });

        this.drawGraph(nodes, links);
      }
    }
  }

  drawGraph(nodes: node[], links: link[]) {
    const dragstarted = (e: any, d: d3.SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (e: any, d: d3.SimulationNodeDatum) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragended = (e: any, d: d3.SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };

    const div = document.getElementById('graph_placeholder');
    if (div){
      div.innerHTML = "";
    }
    
    const svg = d3.select('#graph_placeholder')
    .append('svg')
    .attr('viewBox', '0 0 500 500');

    if (!div) return;
    console.log(div.clientWidth);

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', ('-0 -5 10 10'))
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 1)
      .attr('stroke-width', "1px")
      .attr('marker-end', 'url(#arrowhead)')
      .selectAll('line')
      .data(links)
      .join('line');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g');

    const circles = node
      .append('circle')
      .attr('r', 10)
      .style('fill', (n) => this.color(n.group.toString()))
      .style('cursor', 'pointer')
      .on('dblclick', (e) => alert(e.srcElement.__data__.name))
      .call(
        d3.drag()
        //.on('start', (e:any, d:any) => dragstarted(e, d))
        //.on('drag', (e:any, d:any) => dragged(e, d))
        //.on('end', (e:any, d:any) => dragended(e, d)),
      );

    const labels = node
      .append('text')
      .text((n) => n.name)
      .attr("text-anchor", "middle")
      .attr('y', -20)
      .style('font-size', '14px')
      .style('fill', 'white');


    const simulation = d3.forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(div.clientWidth / 2, 200))
      .tick()
      .on('tick', () => {
        node.attr('transform', (n: any) => 'translate(' + n.x + ',' + n.y + ')');
        link
          .attr('x1', (l: any) => l.source.x)
          .attr('y1', (l: any) => l.source.y)
          .attr('x2', (l: any) => l.target.x)
          .attr('y2', (l: any) => l.target.y);
      });
  }

}
