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
  searchStr:string="";
  filteredLibs: Observable<Library[]>;

  showModal: boolean = false;

  constructor(public accessorsService: AccessorsService,
    public router: Router) {
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
