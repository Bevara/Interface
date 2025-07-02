import { Component } from '@angular/core';
import { AccessorsService } from './services/accessors.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './auth/auth.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ModalComponent } from './modal/modal.component';
import { AddComponent } from './add/add.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SplashComponent } from "./splash/splash.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, ModalComponent, SplashComponent, AddComponent, SideNavComponent, AuthComponent, SplashComponent]
})
export class AppComponent {
  title = 'interface';
  showsplashcreen = true;
  constructor(public accessorsService : AccessorsService,
    public authService : AuthService
    ) { }

}
