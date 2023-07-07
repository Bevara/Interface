import { Component, OnInit } from '@angular/core';
import { AccessorsService, Library } from '../services/accessors.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss']
})
export class DevelopComponent implements OnInit {
  search = new FormControl();
  filteredLibs: Observable<Library[]>;

  showModal = false;

  constructor(public accessorsService: AccessorsService,
    public router: Router) {

    if (!accessorsService.isReady){
      accessorsService.readyEvent.subscribe(event => this.search.setValue(""))
    }

    this.filteredLibs = this.search.valueChanges.pipe(
      startWith(""),
      map(lib => this._filterLibs(lib)),
    );
  }

  private _filterLibs(value: string): Library[] {
    const filterValue = value.toLowerCase();

    return this.accessorsService.all.filter(lib => lib.name.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    
  }

}
