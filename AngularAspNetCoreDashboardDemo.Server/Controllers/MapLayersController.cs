using Microsoft.AspNetCore.Mvc;

namespace AngularAspNetCoreDashboardDemo.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapLayersController : ControllerBase
    {
        private readonly ILogger<MapLayersController> _logger;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public MapLayersController(ILogger<MapLayersController> logger, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }


        [HttpGet(Name = "GetMapLayer")]
        public string GetMapLayer(string layer, string type, string year)
        {
            var filePath = "";
            if (layer == "county")
                filePath = _hostingEnvironment.ContentRootPath + "/JsonData/" + FunctionHelper.GetCountyJsonFileName(year, type);           
            else if(layer == "fire")            
                filePath = _hostingEnvironment.ContentRootPath + "/JsonData/" + FunctionHelper.GetFirePointsFileName(year);            
            else            
                filePath = _hostingEnvironment.ContentRootPath + "/JsonData/" + FunctionHelper.GetStateJsonFileName(year, type);           

            USDAGeoJsonModel uSDAGeoJsonModel = new(year, filePath);
            var jsonStateResults = uSDAGeoJsonModel.GetGeoJson();

            return jsonStateResults;
        }

    }
}
