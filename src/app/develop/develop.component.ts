import { Component} from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Library } from '../services/libraries.service';
import {environment} from '../../environments/environment';
import { vscode } from "../utilities/vscode";

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss']
})
export class DevelopComponent {
  search = new FormControl();
  filteredLibs: Observable<Library[]>;
  initialSearch = "";

  showModal = false;

  constructor(public accessorsService: AccessorsService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.filteredLibs = this.search.valueChanges.pipe(
      startWith(""),
      map(lib => this._filterLibs(lib)),
    );

    if (!this.accessorsService.isReady) {
      this.accessorsService.readyEvent.subscribe(event => {
        this.search.setValue(this.initialSearch);
      });
    }

    activatedRoute.queryParams
      .subscribe(params => {
        if ("filter" in params) {
          this.initialSearch = params["filter"];
          this.search.setValue(this.initialSearch);
        }
      });

  }

  private _filterLibs(value: string): Library[] {
    const filterValue = value.toLowerCase();

    return this.accessorsService.libs.all.filter(lib => lib.name.toLowerCase().includes(filterValue));
  }

  addToExplorer(lib : Library){
    if(environment.vscode){
      vscode.postMessage({ type: 'explore', url: lib.sources, filter:lib.name});
    }
  }
}
