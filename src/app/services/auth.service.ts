import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Sdk from 'casdoor-js-sdk';

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
  _username= '';
  _isLoggedIn = false;
  _tokenReceived = false;
  sdk = new Sdk(config);

  constructor() {
    if (this.sessionToken) {
      this.getInfo().then((res) => this.setInfo(res));
    }

  }

  get username(){
    return this._username;
  }

  get isLoggedIn(){
    return this._isLoggedIn;
  }

  async getInfo() {
    const token = this.sessionToken;
    if (!token) {
      return;
    } else {
      const response = await fetch(`${environment.auth_url}/api/getUserInfo?token=${token}`);
      return response.json();
    }
  }

  setInfo(res: any) {
    const userinfo = res;
    this._username = userinfo.name;
    this._isLoggedIn = true;
  }

  signOut() {
    this.sessionToken = null;
    this._tokenReceived = false;
    this._isLoggedIn = false;
  }

  signIn(){
    this.sdk.signin(environment.auth_url).then((res: any) => {
      if (res.token){
        this.sessionToken = res.token;
        this._tokenReceived = true;

        this.getInfo().then((res) => this.setInfo(res));
      }
    });
  }

  get signinUrl(){
    return this.sdk.getSigninUrl();
  }

  get sessionToken() : string | null{
    return sessionStorage.getItem('token');
  }

  set sessionToken(value : string | null){
    if (value == null){
      sessionStorage.removeItem('token');
    }else{
      sessionStorage.setItem('token', value);
    }
  }
}
