import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { EtatDeclaration } from '../models/complaint.model';
import { ComplaintsService } from '../services/complaints.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private  complaintService:ComplaintsService,@Inject(LOCALE_ID) private locale:string) { }
  private  labels=new Array<string>();
  private monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
  private data=[0,0,0,0,0,0,0,0,0,0,0,0]
  enattend:number=0;
  encour:number=0;
  trite:number=0;

  ngOnInit(): void {

    this.complaintService.getAllDec().subscribe(
      data=>{
        console.log(data)
        data.forEach(
          (elemet)=>{
            this.data[Number(this.toLocalDate(elemet.dateDecl)) - 1]+=1;
            elemet.etatDeclarations=elemet.etatDeclarations.sort(
              (objA:EtatDeclaration, objB:EtatDeclaration) => objB["dateEtat"] - objA["dateEtat"],
            )
            if( elemet.etatDeclarations[0].etat.id_et == 1){
              this.enattend++;
            }
            else if (elemet.etatDeclarations[0].etat.id_et == 2) {
              this.encour++;
            }else{
              this.trite++;
            }


          }
        )
        console.log(this.data);
        const myChart = new Chart("myChart", {
          type: 'line',
          data: {
            labels: this.monthNames,
            datasets: [{
              label: '# de declaration pour chaque mois ',
              data: this.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });


      }
    )

  }

  public  toLocalDate(utc: string | number | Date){

    return formatDate(new Date(utc).toLocaleString(),'MM',this.locale);

  }


}
