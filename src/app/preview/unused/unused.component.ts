import { Component, EventEmitter, Input, OnInit, Renderer2 } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AccessorsService } from 'src/app/services/accessors.service';
import { Library } from 'src/app/services/libraries.service';

@Component({
  selector: 'app-unused',
  templateUrl: './unused.component.html',
  styleUrls: ['./unused.component.scss']
})
export class UnusedComponent implements OnInit  {
  @Input() tabEvent: EventEmitter<MatTabChangeEvent> | null = null;
  @Input() universal_elt = "";

  unused: Library[] = [];
  
  constructor(
    public router: Router,
    public accessorsService: AccessorsService) { 
      
    }
    
  ngOnInit(): void {
    if (this.tabEvent){
      this.tabEvent.subscribe(changeEvent => {
        if (changeEvent.tab.textLabel == "Unused"){
          this.populateUnused();
        }
      });
    }
  }
    
    async populateUnused() {
      const preview_elt = document.getElementById(this.universal_elt) as any;
      if (preview_elt) {
        const props = await preview_elt.properties(["connected"]);
  
        if ( props && props["connected"]) {
          this.unused = this.accessorsService.libs.getUnusedFromConnectedList(props["connected"]);
        }
      }
    }
}
