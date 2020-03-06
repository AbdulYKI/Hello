using System;

using System.Security.Claims;

using System.Threading.Tasks;

using Hello.API.Data;

using Microsoft.AspNetCore.Mvc.Filters;

using Microsoft.Extensions.DependencyInjection;



namespace Hello.API.Helpers

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

            var repo = resultContext.HttpContext.RequestServices.GetService<IHelloRepository>();

            var user = await repo.GetUser(userId);

            user.LastActive = DateTime.UtcNow;

            await repo.SaveAll();

        }

    }

}