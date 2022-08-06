import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private  localService:LocalService,private  route:Router) { }

  ngOnInit(): void {

  }


  logOut(){
    this.localService.clearData();
    this.route.navigate(['/login']);
  }

}
