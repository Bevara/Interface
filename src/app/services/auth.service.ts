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
 _githubUser :any = null;
 _hasGit = false;

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
    if (this.isLoggedIn && this.account)
      return this.account.name;
    else
    return null;
  }

  get isLoggedIn() {
    if (environment.vscode) {
      return this.account != null;
    } else {
      return true;
    }
  }

  async getInfo() {
    const sessionToken = environment.vscode? this._sessionToken : this.sessionToken;
    const response = await fetch(`${environment.auth_url}/api/getUserInfo?token=${sessionToken}`);
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

  logout() {
    if (environment.vscode) {
      vscode.postMessage({ type: 'logout' });
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

  loginToGithub(){
    vscode.postMessage({ type: 'loginToGithub' });
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



  get isAuthtoGithub(){
    if (environment.vscode) {
      return this._githubUser != null;
    } else {
      return true;
    }
  }

  set githubUser(user){
    this._githubUser = user;
  }

  get githubUser(){
    return this._githubUser;
  }

  get owner(){
    if (this._githubUser){
      return this._githubUser.login;
    }
    return null;
  }

  get hasGit(){
    if (environment.vscode) {
      return this._hasGit;
    } else {
      return true;
    }
  }

  set hasGit(value){
    this._hasGit = value;
  }
}
