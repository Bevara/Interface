import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
  constructor(public accessorsService : AccessorsService) { 

  }
}
