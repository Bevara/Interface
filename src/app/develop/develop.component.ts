import { Component} from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Library } from '../services/libraries.service';
import {environment} from '../../environments/environment';
import { vscode } from "../utilities/vscode";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss']
})
export class DevelopComponent {
  search = new FormControl();
  filteredLibs: Observable<Library[]>;
  initialSearch = "";


  constructor(
    public accessorsService: AccessorsService,
    private authService : AuthService
  ) {
    this.filteredLibs = this.search.valueChanges.pipe(
      startWith(""),
      map(lib => this._filterLibs(lib)),
    );

    if (!this.accessorsService.isReady) {
      this.accessorsService.libs.readyEvent.subscribe(event => {
        this.search.setValue(this.initialSearch);
      });
    }
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

  addToLibs(lib : Library){
    if (lib.licence_required){
      this.accessorsService.libs.licence_required = true;
     }else{
      this.accessorsService.libs.addLibraryStr(lib.name);
     }
  }

  addAccessor(){
    if (!this.accessorsService.is_vscode){
      this.accessorsService.showModalAdd = true;
      return;
    }

    if (!this.authService.isLoggedIn){
      this.accessorsService.showModalNeedLogin = true;
      return;
    }
    this.accessorsService.showModalAdd = true;
  }
}
