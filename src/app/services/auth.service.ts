import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Sdk from 'casdoor-js-sdk';
import { vscode } from "../utilities/vscode";

const config = {
  serverUrl: environment.cas_url,
  clientId: "1a1be4e3933c8d2ee041",
  organizationName: "Bevara",
  appName: "app-bevara_access",
  redirectPath: "/callback",
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sdk = new Sdk(config);
  _sessionToken :string | null = null;
 account : any;

  constructor() {
    if (!environment.vscode){
      const url = new URL(window.location.href);
      const params = url.searchParams;
      if (params.get('code')){
        this.sessionToken = params.get('code');
      }
    }
  }

  get username() {
    if (this.isLoggedIn)
      return this.account.name;
    else
    return null;
  }

  get isLoggedIn() {
    return this.account != null;
  }

  async getInfo() {
    const sessionToken = environment.vscode? this._sessionToken : this.sessionToken;
    const response = await fetch(`${environment.auth_url}/api/getUserInfo?token=${this.sessionToken}`);
    return response.json();
  }

  setInfo(res: any) {
    const userinfo = res;
  }

  switchUser() {
    if (environment.vscode) {
      vscode.postMessage({ type: 'switchUser' });
    } else {
      this.gotoSignInPage();
    }
  }

  signIn() {
    this.sdk.signin(environment.auth_url).then((res: any) => {
      if (res.token) {
        this.sessionToken = res.token;

        this.getInfo().then((res) => this.setInfo(res));
      }
    });
  }

  gotoSignInPage(){
    if (environment.vscode) {
      vscode.postMessage({ type: 'login' });
    } else {
      window.location.href = this.sdk.getSigninUrl();
    }
  }

  get sessionToken(): string | null {
    if (environment.vscode) {
      vscode.postMessage({ type: 'getToken' });
      return null;
    } else {
      return sessionStorage.getItem('token');
    }
  }

  set sessionToken(value: string | null) {
    if (environment.vscode) {
      if (value){
        this._sessionToken = value;
        this.getInfo();
      }
    } else {
      if (value == null) {
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', value);
      }
    }
  }
}
