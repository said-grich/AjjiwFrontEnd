import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ComplaintsService} from "../services/complaints.service";
import {Complaint, EtatDeclaration} from "../models/complaint.model";
import {formatDate} from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { CompliantDetailesComponent } from './compliant-detailes/compliant-detailes.component';



@Component({
  selector: 'app-complaints-list',
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.css']
})
export class ComplaintsListComponent implements OnInit {


  private _complaintList: Array<Complaint> | undefined;
  dataSource: MatTableDataSource<Complaint> =new MatTableDataSource;
  @ViewChild('paginator') paginator: MatPaginator;


  constructor(private complaintService:ComplaintsService,@Inject(LOCALE_ID) private locale: string,public dialog: MatDialog) { }
  get complaintList(): Array<Complaint> {
    if (this._complaintList==null){
      this._complaintList=new Array<Complaint>();

    }
    return this._complaintList;

  }

  set complaintList(value: Array<Complaint>) {
    this._complaintList = value;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.complaintService.getAllDec().subscribe(
      data=>{
        this.complaintList=data
        this.complaintList.forEach(
        elemet=>{
          elemet.etatDeclarations=elemet.etatDeclarations.sort(
            (objA:EtatDeclaration, objB:EtatDeclaration) => objB["dateEtat"] - objA["dateEtat"],
          )
        }
        )
        this.dataSource = new MatTableDataSource( this.complaintList);
        this.dataSource.paginator = this.paginator;

      }
    )}
  displayedColumns: string[] = ['id','photoUri','title','utilisateur','adresse','category','date','etat'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
   public  toLocalDate(utc: string | number | Date){

    return formatDate(new Date(utc).toLocaleString(),'yyyy-MM-dd',this.locale);

  }

  public setColorByEtat(etat:String){

    if(etat=="en attente"){
      return "warn"
    }else if (etat=="en cours de traitement"){
      return "primary"
    }else{
      return "accent"
    }
  }
  setAccComplaint(value: Complaint){
    this.complaintService.acctComplaint=value;
    this.openDialog();
  }
  openDialog() {
    this.dialog.open(CompliantDetailesComponent, {

      minWidth:'80%',
      minHeight: '80%'
    });
  }
}

