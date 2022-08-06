import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormControl, ɵValue} from "@angular/forms";
import {Convert,User} from "../models/user.model";
import {MatSnackBar} from "@angular/material/snack-bar";
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _isLogin:boolean=false;
  constructor(private http: HttpClient ,private _snackBar: MatSnackBar) { }

  public login(email: ɵValue<FormControl<string | null>> | undefined, password: ɵValue<FormControl<string | null>> | undefined){
    let loginInfo={
      "email":email,
      "password":password
    }
    return this.http.post<User>(environment.baseUrl+"front/auth/login",loginInfo);
}
  get isLogin(): boolean {
    return this._isLogin;
  }
  set isLogin(value: boolean) {
    this._isLogin = value;
  }
}
