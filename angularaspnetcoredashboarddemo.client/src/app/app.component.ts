import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';

// Don't forget to import the Leaflet CSS in your styles.css or angular.json
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})

// AppComponent implements OnInit to use the ngOnInit lifecycle hook
export class AppComponent implements OnInit {
  public year: any;
  public type: any;

  // Inject HttpClient into the constructor
  constructor(private http: HttpClient) { }

  // Use ngOnInit to perform initialization logic
  ngOnInit() {
    this.getGeoJsonData('ussec', '2025');
  }

  // Method to update type and year based on child component events
  updateType(type: string, year: string): void {
    console.log('Received type value:', type);
    console.log('Received year value:', year);

    this.getGeoJsonData(type, year);
  }

  // Method to fetch GeoJSON data based on type and year
  getGeoJsonData(clickType: string, clickYear: string): void {
    //use this to pull the files from the API for production
    const requestState = this.http.get<any>('/maplayers?layer=state&year=' + clickYear + '&type=' + clickType);
    const requestCounty = this.http.get<any>('/maplayers?layer=county&year=' + clickYear + '&type=' + clickType);
    const requestFirePoints = this.http.get<any>('/maplayers?layer=fire&year=' + clickYear + '&type=' + clickType);


    // Use forkJoin to wait for all requests to complete
    forkJoin([requestState, requestCounty, requestFirePoints]).subscribe({
      // Destructure the results into individual variables, make sure to use next, and error for subscribe.
      next: ([dataState, dataCounty, dataFire]) => {
        // All requests have completed, and their results are available here
        console.log('Data from request state geoJson:', dataState);
        console.log('Data from request county geoJson:', dataCounty);
        console.log('Data from request county geoJson:', dataFire);
        this.year = clickYear;
        this.type = clickType;
        this.initMap(dataState, dataCounty, dataFire);
      },
      // Handle errors if any of the requests fail
      error: (error) => {
      console.error('Error fetching data for map layers:', error);
    }
    });
  }

  // Title for the component
  title = 'angularaspnetcoredashboarddemo.client';

  // Leaflet map instance
  private map!: L.Map

  // Example marker array (not used in the current implementation)
  markers: L.Marker[] = [
    L.marker([37.8, -96])
  ];


  // Method to get style for state features based on properties
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
    else if (value > (2 * currentInterval)) {
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

  // Method to get style for county features based on properties
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


  // Method to load GeoJSON data and initialize the map
  private loadGeoJSON(stateJson: any, countyJson: any, fireJson: any): void {
    // Define tile layer URLs
    const worldImagery = 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const openStreetMap = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const lightGrayBase = 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    // Initialize the map and set view
    this.map = L.map('map').setView([37.8, -96], 4);

    // Create GeoJSON layers for states, counties, and fire points
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

    // Create county layer with popups
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

    // Create fire points layer with CircleMarkers and popups
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
      // Use CircleMarker for better visibility
      pointToLayer: function (feature, latlng) {
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

    // Apply styles and add layers to the map
    stateLayer.setStyle(this.getStateStyle);
    stateLayer.addTo(this.map);
    countyLayer.setStyle(this.getCountyStyle);
    countyLayer.addTo(this.map);
    fireLayer.addTo(this.map);

    // Define base maps and overlay maps
    const baseMaps = {
      "World Imagery": L.tileLayer(worldImagery).addTo(this.map),
      "Open Street Map": L.tileLayer(openStreetMap),
      "Light Gray Canvas": L.tileLayer(lightGrayBase)
    };

    // Define overlay maps
    const overlayMaps = {
      "States": stateLayer,
      "Counties": countyLayer,
      "Fire Points": fireLayer
    };

    // Add layer control to the map
    const layerControl = L.control.layers(baseMaps, overlayMaps);
    layerControl.addTo(this.map);


    // Add legend to the map
    const legend = new (L.Control.extend({
      options: {
        position: 'bottomleft' // or 'topright', 'bottomleft', 'topleft'
      },
      onAdd: function (map: any) {

        const currentInterval = 5;
        
        // Create a div for the legend
        var div = L.DomUtil.create('div', 'info legend'),
          grades = [1, (2 * currentInterval), (3 * currentInterval), (4 * currentInterval)];

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

    // Add the legend to the map
    this.map.addControl(legend);

  }

  // Method to initialize the map with given state, county, and fire data
  private initMap(stateData: any, countyData: any, fireData: any) {

    // Remove existing map instance if it exists
    if (this.map) {
      this.map.remove(); 
    }

    // Load GeoJSON data and set up the map
    this.loadGeoJSON(stateData, countyData, fireData);

  }



}
