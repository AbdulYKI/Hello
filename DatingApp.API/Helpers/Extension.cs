using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extension
    {
        public static void AddApplicationError (this HttpResponse response, Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature error, string message){

            response.Headers.Add("Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }
    }
}