namespace AngularAspNetCoreDashboardDemo.Server
{
    // Helper class for determining file names based on year and type
    public static class FunctionHelper
    {
        // Returns the appropriate county JSON file name based on the year and type
        public static string GetCountyJsonFileName(string year, string type)
        {
            if (type == "pres")
                return year + "CountyPresLayer.json";
            else
                return year + "CountyUsSecLayer.json";
        }

        // Returns the appropriate state JSON file name based on the year and type
        public static string GetStateJsonFileName(string year, string type)
        {
            if (type == "pres")
                return year + "StatePresLayer.json";
            else
                return year + "StateUsSecLayer.json";
        }

        // Returns the radar chart JSON file name based on the type
        public static string GetRadarJsonFileName(string type)
        {
            if (type == "pres")
                return "PresRadarChartData.json";
            else
                return "UsSecRadarChartData.json";
        }

        // Returns the fire points JSON file name based on the year
        public static string GetFirePointsFileName(string year)
        {
            return (year == "2025" ? "2024NationalUSFSFireOccurrencePoint.json" : year + "NationalUSFSFireOccurrencePoint.json");
        }

    }
}
