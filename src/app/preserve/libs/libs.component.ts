import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccessorsService, Library } from 'src/app/services/accessors.service';
import {Observable,Subject} from 'rxjs';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-libs',
  templateUrl: './libs.component.html',
  styleUrls: ['./libs.component.scss']
})
export class LibsComponent {
  addOnBlur = false;

  @ViewChild('libInput') libInput: ElementRef = {} as ElementRef;

  constructor(public accessorsService : AccessorsService) { 
    this.filteredLibs = this.libCtrl.valueChanges.pipe(
      map(lib => (lib ? this._filterLibs(lib) : this.accessorsService.remain.slice())),
    );
  }
  
  libCtrl = new FormControl('');
  filteredLibs: Observable<Library[]>;

  private _filterLibs(value: string): Library[] {
    const filterValue = value.toLowerCase();

    return this.accessorsService.remain.filter(lib => lib.name.toLowerCase().includes(filterValue));
  }

  addLibraryAutoComplete(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;

    if (value) {
      this.accessorsService.addLibraryStr(value);
    }
    this.libInput.nativeElement.value = '';
    this.libCtrl.setValue(null);
  }
}
