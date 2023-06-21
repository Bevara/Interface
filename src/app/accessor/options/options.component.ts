import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  constructor(public accessorsService : AccessorsService) { 

  }
}
