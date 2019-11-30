using System;

using System.Security.Claims;

using System.Threading.Tasks;

using DatingApp.API.Data;

using Microsoft.AspNetCore.Mvc.Filters;

using Microsoft.Extensions.DependencyInjection;



namespace DatingApp.API.Helpers

{

    public class LogUserActivity : IAsyncActionFilter

    {

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)

        {
            //the resultContext gives access to the token which in turn
            //gives access to the userId 
            var resultContext = await next();



            var userId = int.Parse(resultContext.HttpContext.User

                .FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = resultContext.HttpContext.RequestServices.GetService<IDatingAppRepository>();

            var user = await repo.GetUser(userId);

            user.LastActive = DateTime.UtcNow;

            await repo.SaveAll();

        }

    }

}