import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public year: any;
  public type: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getGeoJsonData('ussec','2025');
  }

  updateType(type: string, year: string): void {
    console.log('Received type value:', type);
    console.log('Received year value:', year);
    // Perform actions with the received value
    this.getGeoJsonData(type, year);
  }

  getGeoJsonData(clickType: string, clickYear: string): void {
    const requestState = this.http.get<any>('/maplayers?layer=state&year=' + clickYear + '&type=' + clickType);
    const requestCounty = this.http.get<any>('/maplayers?layer=county&year=' + clickYear + '&type=' + clickType);
    const requestFirePoints = this.http.get<any>('/maplayers?layer=fire&year=' + clickYear + '&type=' + clickType);

    forkJoin([requestState, requestCounty, requestFirePoints]).subscribe(
      ([dataState, dataCounty, dataFire]) => {
        // All requests have completed, and their results are available here
        console.log('Data from request state geoJson:', dataState);
        console.log('Data from request county geoJson:', dataCounty);
        console.log('Data from request county geoJson:', dataFire);
        this.year = clickYear;
        this.type = clickType;
        this.initMap(dataState, dataCounty, dataFire);
      },
      error => {
        console.error('Error fetching data for map layers:', error);
      }
    );
  }

  title = 'angularaspnetcoredashboarddemo.client';
  private map!: L.Map

  markers: L.Marker[] = [
    L.marker([37.8, -96])
  ];

  ngAfterViewInit() {
    //this.initMap();
  }

  getStateStyle(feature: any) {
    const currentInterval = 5;
    const value = (feature.properties ? feature.properties.TotalPresDecs : 0);
    let fillColor;

    if (value >= (4 * currentInterval)) {
      fillColor = '#011a08';
    }
    else if (value > (3 * currentInterval)) {
      fillColor = '#3d9137';
    }
    else if (value > (2 * currentInterval))
    {
      fillColor = '#88d669';
    }
    else if (value > 0) {
      fillColor = '#b2ed9a';
    }
    else {
      fillColor = '#FFFFFF00'; 
    }

    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: 'white', 
      fillOpacity: 0.7
    };
  }

  getCountyStyle(feature: any) {
    const totalDecs = (feature.properties ? feature.properties.TotalPresDecs : 0);
    const totalDecsWithCrops = (feature.properties ? feature.properties.DecsWithCrops : 0);
    let fillColor;

    if (totalDecs > 0 && totalDecsWithCrops > 0) {
      fillColor = 'red';
    }
    else if (totalDecs > 0) {
      fillColor = '#5E87E8';
    }
    else {
      fillColor = '#FFFFFF00';
    }

    return {
      fillColor: fillColor,
      weight: .6,
      opacity: .5,
      color: "black",
      fillOpacity: 0.7
    };
  }



  private loadGeoJSON(stateJson: any, countyJson: any, fireJson: any): void {
    const worldImagery = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const openStreetMap = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const lightGrayBase = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    this.map = L.map('map').setView([37.8, -96], 4);

    const stateLayer = L.geoJson(stateJson, {
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          var props = feature.properties;
          var content = '<div style="font-size:12px;padding-bottom:10px;">' + 'US Secretary of Ag' + '</div>' + (props ?
            '<div><b>State: </b>' + props.name
            + '<div><b>Total Emergency Declarations: </b>' + props.TotalPresDecs + '</div><div>'
            + '<div><b>Declared Disasters: </b>' + props.ListOfDisasters + '</div><div>'
            + (props.DecsWithCrops ? '<div><b>Total crop production types: </b>' + props.DecsWithCrops + '</div><div>'
              + '<div><b>Crop Details: </b><small>' + props.CropDetailList + '</small></div><div>'
              : '')
            : feature.properties.name);
          layer.bindPopup(content);
        }
      }
    });

    const countyLayer = L.geoJson(countyJson, {
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          var props = feature.properties;
          var content = '<div style="font-size:12px;padding-bottom:10px;">' + 'US Secretary of Ag' + '</div>' + (props ?
            '<div><b>State: </b>' + props.name
            + '<div><b>Total Emergency Declarations: </b>' + props.TotalPresDecs + '</div><div>'
            + '<div><b>Declared Disasters: </b>' + props.ListOfDisasters + '</div><div>'
            + (props.DecsWithCrops ? '<div><b>Total crop production types: </b>' + props.DecsWithCrops + '</div><div>'
              + '<div><b>Crop Details: </b><small>' + props.CropDetailList + '</small></div><div>'
              : '')
            : feature.properties.name);
          layer.bindPopup(content);
        }
      }
    });


    const fireLayer = L.geoJSON(fireJson, {
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          var content = '<div><b>Fire Name: </b>' + feature.properties.FIRENAME + '</div>' +
            '<div><b>Fire Year: </b>' + feature.properties.FIREYEAR + '</div>' +
            '<div><b>Fire Discover Date: </b>' + feature.properties.DISCOVERYDATETIME + '</div>' +
            '<div><b>Fire Out Date: </b>' + feature.properties.FIREOUTDATETIME + '</div>' +
            '<div><b>Acres Burned: </b>' + feature.properties.TOTALACRES + '</div>' +
            '<div><b>Fire Cause: </b>' + feature.properties.STATCAUSE + '</div>';
          layer.bindPopup(content);
        }
      },
      pointToLayer: function (feature, latlng) {
        // You can customize the appearance of the CircleMarker here
        return new L.CircleMarker(latlng, {
          radius: 7, // Set the radius in pixels
          fillColor: "#FDA50F",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
    })

    stateLayer.setStyle(this.getStateStyle);
    stateLayer.addTo(this.map);
    countyLayer.setStyle(this.getCountyStyle);
    countyLayer.addTo(this.map);
    fireLayer.addTo(this.map);

    const baseMaps = {
      "World Imagery": L.tileLayer(worldImagery).addTo(this.map),
      "Open Street Map": L.tileLayer(openStreetMap),
      "Light Gray Canvas": L.tileLayer(lightGrayBase)
    };

    const overlayMaps = {
      "States": stateLayer,
      "Counties": countyLayer,
      "Fire Points": fireLayer
    };

    const layerControl = L.control.layers(baseMaps, overlayMaps);
    layerControl.addTo(this.map);



      const legend = new (L.Control.extend({
        options: {
          position: 'bottomleft' // or 'topright', 'bottomleft', 'topleft'
        },
        onAdd: function (map: any) {

          const currentInterval = 5;
          var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, (2 * currentInterval), (3 * currentInterval), (4 * currentInterval)],
            labels = [];

          div.innerHTML += '<div>State Disasters</div>'

          for (var i = 0; i < grades.length; i++) {
            let d = grades[i] + 1;
            let color = d >= (4 * currentInterval) ? '#011a08' :
              d > (3 * currentInterval) ? '#3d9137' :
                d > (2 * currentInterval) ? '#88d669' :
                  (d > (1 * currentInterval) || d > 0) ? '#b2ed9a' :
                    '#FFFFFF00'; 
            div.innerHTML +=
              '<i style="background:' + color + '"></i> ' +
            grades[i] + (grades[i + 1] ? (currentInterval > 1 ? (' - ' + (grades[i + 1] - 1)) : '') + '<br>' : '+');
          }

          div.innerHTML += '<div style="padding-top:10px;">County Level (2022 Census)</div>';
          div.innerHTML += '<i style="background:red"></i>Crop Production <br>';
          div.innerHTML += '<i style="background:#5E87E8"></i>No Crop Production<br>';

          div.innerHTML += '<div class="row mt-2"> <div class="col-2"><div class="circle"></div></div> <div class="col-10">USFS Fire Orgins</div> </div>'

          return div;
        }
      }));

    this.map.addControl(legend);

    

  }

  private initMap(stateData: any, countyData: any, fireData: any) {

    if (this.map) {
      this.map.remove(); // Clean up the existing map instance
    }
    this.loadGeoJSON(stateData, countyData, fireData);

  }



}
