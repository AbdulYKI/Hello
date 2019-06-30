using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        { //Configuration helps us reach stuff in appsettings.json
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {   //Connecting to the database
            services.AddDbContext<DataContext>(x=> x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            //adding mvc and setting comp version
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            //adds cors specified in Configure(IApplicationBuilder app,IHostingEnvironment env)
            services.AddCors();
            //adds the authentication service
            services.AddScoped<IAuthRepository,AuthRepository>();
            //adds token authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(Options=>
            { Options.TokenValidationParameters=new TokenValidationParameters {

                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes( Configuration.GetSection("Appsettings:Token").Value)),
                ValidateIssuerSigningKey=true,
                ValidateIssuer=false,
                ValidateAudience=false
                                                                        };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // app.UseHsts();
            }

           //  app.UseHttpsRedirection();
            //specifies what cors to use
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
               app.UseAuthentication();
            app.UseMvc();
         
        }
    }
}
