import { Component } from '@angular/core';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent {
  showModal = false;

  constructor(public accessorsService : AccessorsService) { }
  
}
