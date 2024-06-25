import { Component } from '@angular/core';
import { AccessorsService } from './services/accessors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'interface';
  constructor(public accessorsService : AccessorsService,
    ) { }

}
