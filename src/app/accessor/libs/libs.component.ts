import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccessorsService} from 'src/app/services/accessors.service';
import {Observable} from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Library } from 'src/app/services/libraries.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-libs',
  templateUrl: './libs.component.html',
  styleUrls: ['./libs.component.scss'],
  standalone:true,
  imports:[MatIconModule, MatFormFieldModule, MatChipsModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, DragDropModule, CommonModule, MatButtonModule],
})
export class LibsComponent {
  addOnBlur = false;

  @ViewChild('libInput') libInput: ElementRef = {} as ElementRef;

  constructor(public accessorsService : AccessorsService) {
    this.filteredLibs = this.libCtrl.valueChanges.pipe(
      map(lib => (lib ? this._filterLibs(lib) : this.accessorsService.libs.remain.slice())),
    );
  }

  libCtrl = new FormControl('');
  filteredLibs: Observable<Library[]>;

  private _filterLibs(value: string): Library[] {
    const filterValue = value.toLowerCase();

    return this.accessorsService.libs.remain.filter(lib => lib.name.toLowerCase().includes(filterValue));
  }

  addLibraryAutoComplete(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;

    if (value) {
      this.accessorsService.libs.addLibraryStr(value);
    }
    this.libInput.nativeElement.value = '';
    this.libCtrl.setValue(null);
  }
}
