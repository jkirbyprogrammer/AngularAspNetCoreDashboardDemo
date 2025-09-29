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
            // Parse the GeoJSON content
            GeoJsonReader reader = new GeoJsonReader();
            // Convert to FeatureCollection
            FeatureCollection featureCollection = reader.Read<FeatureCollection>(jsonCountyResults);
            // Serialize FeatureCollection back to JSON string
            string jsonString = JsonConvert.SerializeObject(featureCollection);

            return jsonString;
        }

    }
}
