import Sdk from 'casdoor-js-sdk';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {

  username= '';
  isLoggedIn = false;
  sdk = new Sdk(config);
  tokenReceived = false;

  ngOnInit() {
    if (window.location.href.indexOf('code') !== -1) {
      if (!sessionStorage.getItem('token')) {

        this.sdk.signin(environment.auth_url).then((res: any) => {
          if (res.token){
            sessionStorage.setItem('token', res.token);
            this.setTokenReceived(true);

            this.getInfo().then((res) => this.setInfo(res));
          }
        });
      }
    }

    if (sessionStorage.getItem('token')) {
      this.getInfo().then((res) => this.setInfo(res));
    }
  }


  async getInfo() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return;
    } else {
      const response = await fetch(`${environment.auth_url}/api/getUserInfo?token=${token}`);
      return response.json();
    }
  }

  setInfo(res: any) {
    const userinfo = res;
    this.setUsername(userinfo.name);
    this.setIsLoggedIn(true);
  }

  gotoSignInPage() {
    window.location.href = this.sdk.getSigninUrl();
  }

  signOut() {
    sessionStorage.removeItem('token');
    this.setTokenReceived(false);
    this.setIsLoggedIn(false);
  }

  setUsername(username: string) {
    this.username = username;
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  setTokenReceived(tokenReceived: boolean) {
    this.tokenReceived = tokenReceived;
  }
}
