import { Component } from '@angular/core';
import { AccessorsService } from './services/accessors.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'interface';
  constructor(public accessorsService : AccessorsService,
    public authService : AuthService
    ) { }

}
