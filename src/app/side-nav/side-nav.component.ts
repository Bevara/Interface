import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import { vscode } from "../utilities/vscode";
import { AccessorsService } from '../services/accessors.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  pinned: boolean = true;

  constructor(
    public accessorsService : AccessorsService

  ) { }

  ngOnInit(): void {
  }

  changePinned(): void {
    this.pinned = !this.pinned;
    setTimeout(async () => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }

  goToLink(url: string){
    if(environment.vscode){
      vscode.postMessage({ type: 'open_link', url: url});
    }else{
      window.open(url, "_blank");
    }
  }
}
