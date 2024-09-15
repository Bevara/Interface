import { Component} from '@angular/core';
import { AccessorsService } from '../services/accessors.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Library } from '../services/libraries.service';
import {environment} from '../../environments/environment';
import { vscode } from "../utilities/vscode";
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss'],
  standalone:true,
  imports:[MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, CommonModule, MatInputModule, MatButtonModule, MatMenuModule]
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

  viewOnGitHub(lib : Library){
    if(environment.vscode){
      vscode.postMessage({ type: 'open_link', url: "https://github.com/"+lib.owner+"/"+lib.repo});
    }
  }

  removeFromList(lib : Library){
    if(environment.vscode){
      vscode.postMessage({ type: 'removeFromList', filter:lib.name});
    }

    this.accessorsService.libs.removeFromList(lib);
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
