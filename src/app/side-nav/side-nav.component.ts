import { Component, OnInit } from '@angular/core';
import { enableRipple } from '@syncfusion/ej2-base';
import { FieldSettingsModel } from '@syncfusion/ej2-navigations';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  pinned: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  changePinned(): void {
    this.pinned = !this.pinned;
    setTimeout(async () => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }

}
