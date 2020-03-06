using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hello.API.Data;
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
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Hello.API.Helpers;
using Microsoft.AspNetCore.Http;
using AutoMapper;

namespace Hello.API
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
            services.AddEntityFrameworkSqlite()
            .AddDbContext<DataContext>(db => db.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            //adds cors specified in Configure(IApplicationBuilder app,IHostingEnvironment env)
            services.AddCors();
            //adding mvc and setting comp version
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
            .AddJsonOptions(opt =>
            {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            //adds signalr
            services.AddSignalR();
            //adds Cloudinaryy Strongly Typed Configuration
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

            //adds the authentication service
            services.AddScoped<IAuthRepository, AuthRepository>();
            //adds the HelloRepository service
            services.AddScoped<IHelloRepository, HelloRepository>();
            //adds automapper 
            services.AddAutoMapper();
            //adds token authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {

                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("Appsettings:Token").Value)),
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var path = context.HttpContext.Request.Path;
                        var accessToken = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(accessToken) &&
                       (path.StartsWithSegments("/api/chat")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            //adds Seed so I can use it in seed
            services.AddTransient<Seed>();
            services.AddTransient<LogUserActivity>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder =>
             {
                 builder.Run(async context =>
                 {
                     context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                     var error = context.Features.Get<IExceptionHandlerFeature>();
                     if (error != null)
                     {
                         context.Response.AddApplicationError(error, error.Error.Message);
                         await context.Response.WriteAsync(error.Error.Message);
                     }
                 });
             });
            }

            // app.UseHttpsRedirection();
            //specifies what cors to use
            // seeder.SeedUsers();
            // seeder.SeedCountries();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200").AllowCredentials());
            app.UseAuthentication();
            app.UseSignalR(routes =>
           {
               routes.MapHub<ChatHub>("/api/chat");
           });
            app.UseMvc();

        }
    }
}
