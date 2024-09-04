import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import { vscode } from "../utilities/vscode";
import { AccessorsService } from '../services/accessors.service';
import { PreviewComponent } from '../preview/preview.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DevelopComponent } from '../develop/develop.component';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  standalone:true,
  imports:[PreviewComponent, MatSidenavModule, DevelopComponent]
})
export class SideNavComponent {


  constructor(
    public accessorsService : AccessorsService

  ) { }


  goToLink(url: string){
    if(environment.vscode){
      vscode.postMessage({ type: 'open_link', url: url});
    }else{
      window.open(url, "_blank");
    }
  }
}
