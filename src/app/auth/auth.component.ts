import Sdk from 'casdoor-js-sdk';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';

const config = {
  serverUrl: environment.cas_url,
  clientId: "1a1be4e3933c8d2ee041",
  organizationName: "Bevara",
  appName: "app-bevara_access",
  redirectPath: "/callback",
};

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone:true,
  imports:[MatToolbarModule]
})
export class AuthComponent implements OnInit {
  environment = environment;

  constructor(
    public auth : AuthService
  ) { }

  ngOnInit() {
    if (window.location.href.indexOf('code') !== -1) {
      if (!this.auth.isLoggedIn) {
        this.auth.signIn();
      }
    }
  }
}
