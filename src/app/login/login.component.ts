import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../services/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalService} from "../services/local.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private router: Router,private loginService:LoginService,private _snackBar: MatSnackBar,private _localService:LocalService) { }
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(5)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

  });

  onSubmit() {
    this.loginService.login(this.loginForm.value.email,this.loginForm.value.password).subscribe(
      data=>{
        // @ts-ignore
        if(data!=-1){
          this._localService.saveData("email",data.email);
          this._localService.saveData("password",data.password);
          this._localService.saveData("cin",data.cin);
          this._localService.saveData("prenom",data.prenom);
          this._localService.saveData("nom",data.nom);
          this._localService.saveData("role",data.role);
          this.loginService.isLogin=true;
          console.log(this.loginService.isLogin)
          this.router.navigate(['/'])
        }else{
          this.loginService.isLogin=false;
          this._snackBar.open('User not found', '', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });

        }

      }
      ,error=>{
        this.loginService.isLogin=false;
        console.log(error)
      }
    )

  }
  ngOnInit(): void {

  }

}
