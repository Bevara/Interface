import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent {
  constructor(public accessorsService : AccessorsService) { }
}
