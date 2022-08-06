import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Complaint, EtatDeclaration } from 'src/app/models/complaint.model';
import { ComplaintsService } from 'src/app/services/complaints.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compliant-detailes',
  templateUrl: './compliant-detailes.component.html',
  styleUrls: ['./compliant-detailes.component.css']
})
export class CompliantDetailesComponent implements OnInit {
  complaint:Complaint;
  baseurl:String=environment.baseUrl;
  map: mapboxgl.Map;

  selectedEtat:string;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 30.332041;
  lng = -5.837940;
  columnList:Array<string>=['id','photoUri','title','utilisateur','adresse','category','date','etat'];
  constructor(private complaintService:ComplaintsService,@Inject(LOCALE_ID) private locale: string) {
    // @ts-ignore
    mapboxgl.accessToken = environment.mapbox.accessToken;

  }
  labelJson = {
    type: 'FeatureCollection',
    features: []
  };
  ngOnInit(): void {
    this.getAccComplaint();
    // @ts-ignore
    mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 5,
      center: [this.complaint.longitude, this.complaint.latitude],

    })
    const marker = new mapboxgl.Marker({
      draggable: false,
    })

      .setLngLat([this.complaint.longitude, this.complaint.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            "<h3>"+this.complaint.title+"</h3><p>"+this.complaint.adresse+"</p>"
          )
          )
      .addTo(this.map);
    this.map.addControl(new mapboxgl.NavigationControl());



  }
  getAccComplaint(){
    this.complaint= this.complaintService.acctComplaint;
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
  addLabel(): void {
    const label = {
      id: this.complaint.id,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [this.complaint.longitude,this.complaint.latitude, ]
      },
      properties: {
        description: this.complaint.title,
        color: 'red'
      }
    };

    // @ts-ignore
    this.labelJson.features.push(label);

    // @ts-ignore
    this.map.getSource('labels').setData(this.labelJson);
  }
  changeEtat(event:any){

   this.complaintService.updateEtat(this.complaint.id.toString(),event.value).subscribe(
     data=>{

       this.complaint.etatDeclarations.push(data);
       this.complaint.etatDeclarations=this.complaint.etatDeclarations.sort(
         (objA:EtatDeclaration, objB:EtatDeclaration) => objB["dateEtat"] - objA["dateEtat"],
       );
     }
   );

  }






}


