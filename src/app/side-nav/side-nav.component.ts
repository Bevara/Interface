import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import { vscode } from "../utilities/vscode";
import { AccessorsService } from '../services/accessors.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
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
