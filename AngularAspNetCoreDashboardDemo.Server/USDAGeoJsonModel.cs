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

        public string GetGeoJson()
        {
            using StreamReader countySr = new(_filePath);
            string jsonCountyResults = countySr.ReadToEnd();
            GeoJsonReader reader = new GeoJsonReader();
            FeatureCollection featureCollection = reader.Read<FeatureCollection>(jsonCountyResults);
            string jsonString = JsonConvert.SerializeObject(featureCollection);


            return jsonString;
        }

    }
}
