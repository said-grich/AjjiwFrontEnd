import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormControl, ɵValue} from "@angular/forms";
import {User} from "../models/user.model";
import {environment} from "../../environments/environment";
import {Complaint, EtatDeclaration} from "../models/complaint.model";
import {LocalService} from "./local.service";

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  private _complaintList: Array<Complaint>;
  private _acctComplaint: Complaint;
  get acctComplaint(): Complaint {
    return this._acctComplaint;
  }

  set acctComplaint(value: Complaint) {
    this._acctComplaint = value;
  }

  constructor(private http: HttpClient,private _localService:LocalService) { }
  get complaintList(): Array<Complaint> {
    if (this._complaintList==null){
      this._complaintList=new Array<Complaint>();

    }
    return this._complaintList;

  }

  set complaintList(value: Array<Complaint>) {
    this._complaintList = value;
  }
  public getAllDec(){
    return this.http.get<Array<Complaint>>(environment.baseUrl+"/front/auth/"+this._localService.getData("email"))
  }
  public updateEtat(id: string,value:string){
    return this.http.get<EtatDeclaration>(environment.baseUrl+"/declaration/updateetat/"+value+"/"+id)
  }

}
