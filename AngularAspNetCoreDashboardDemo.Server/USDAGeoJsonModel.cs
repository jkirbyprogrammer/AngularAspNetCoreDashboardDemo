using GeoJSON.Net.Feature;
using NetTopologySuite.IO;
using Newtonsoft.Json;


namespace AngularAspNetCoreDashboardDemo.Server
{
    public class USDAGeoJsonModel
    {
        private readonly string _year;
        private readonly string _filePath;

        public USDAGeoJsonModel(string year, string filepath)
        {
            _year = year;
            _filePath = filepath;
        }

        // Method to read and return GeoJSON data as a string
        public string GetGeoJson()
        {
            // Read the GeoJSON file
            using StreamReader countySr = new(_filePath);
            // Read the entire file content
            string jsonCountyResults = countySr.ReadToEnd();

            ////Example: If you need to make changes to a geojson properties, use code below as guide to parse into feature Collection...
            //GeoJsonReader reader = new GeoJsonReader();
            //FeatureCollection featureCollection = reader.Read<FeatureCollection>(jsonCountyResults);
            //foreach (var feature in featureCollection.Features)
            //{
            //    // Example modification: Add a new property to each feature
            //    var propValue = 301;
            //    feature.Properties["TestPropValue"] = propValue;
            //}   

            //string jsonString = JsonConvert.SerializeObject(featureCollection);

            //return jsonString;
            ////End of Example

            return jsonCountyResults;
        }

    }
}
