using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Hello.API.Helpers
{
    public static class Extension
    {
        public static void AddApplicationError(this HttpResponse response, Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature error, string message)
        {

            response.Headers.Add("Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        public static void AddPaginationHeader(this HttpResponse response,
         int currentPage, int pageSize, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, totalPages, pageSize, totalItems);
            var cammelCaseSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, cammelCaseSettings));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
        public static int CalculateAge(this DateTime dateOfBirth)
        {

            var age = DateTime.Now.Year - dateOfBirth.Year;
            if (dateOfBirth.AddYears(age) > DateTime.Now)
            {
                age--;
            }
            return age;

        }
    }
}