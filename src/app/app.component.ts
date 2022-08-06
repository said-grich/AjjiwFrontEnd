import {Component, OnInit} from '@angular/core';
import {LocalService} from "./services/local.service";
import {LoginService} from "./services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Ajjiw';
  constructor(private router: Router,private _localService:LocalService ,private  _loginService:LoginService) {
  }
  isLogin(){
    return this._loginService.isLogin;
  }
  ngOnInit(): void {
    let email =this._localService.getData("email");
    if(email!=null){
      this._loginService.isLogin=true;
      console.log(this._loginService.isLogin)
    }else {
      console.log(this._loginService.isLogin)
      this.router.navigate(['/login']);
    }

  }

}
