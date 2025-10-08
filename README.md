Interactive Leaflet map example using Angular for client side and C# ASP.NET Core for server side. This uses data from 2022 crop census, Disaster Designation Information Made By the US Secretary of Agriculture, Presidential Emergency Declarations, USFS fire occurance data all linked together in a clean interactive web map at county & state level. Fire geo points are converted to circle makers with pop up details. County and state polygons also have popup details. 

- Project uses data that was pulled from USDA from 2018 to mid 2025: 
  - https://www.fsa.usda.gov/resources/disaster-assistance-program/disaster-designation-information
  - USDA quick stats
- I have Angular client and ASP.NET C# server applications hosted on Azure, public link below: 
  - [Link to Angular Leaflet Map](https://mango-flower-0bdde0610.2.azurestaticapps.net/) 
- Application Details:
  - Client Side (Angular)
    - Angular v19.2.0
    - TypeScript v5.7.2
    - Leaflet v1.9.4
    - RxJS v7.8.0
    - Bootstrap v5.3.8
    - HTML
    - JavaScript
    - CSS
  - Server Side (C# ASP.NET Core API application):
    - Purpose: To serve GeoJson for map layers.
    - ASP.NET Core v8.0
    - C# v12
    - GeoJson.Net v1.4.1
    - NetTopologySuite v2.6.0
    - NetTopologySuite.IO.GeoJson v4.0.0
    - Newtonsoft.json 13.0.4
- Angular/TypeScript and leaflet can be a challenge to get to work together due to the lack of documentation, but after creating this example I plan on using Leaflet and Angular more together. Due to the lack of documentation, I am going to put together some good documentation from start to finish integrating leaflet into an Angular Application, covering all functionality in this application. Once that is completed, I will provide the public link/s.
 
