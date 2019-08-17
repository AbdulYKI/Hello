using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    //Inheriting from ControllerBase gives us the ability to use http responses in our return values
    //and it helps with validation where without it we would have needed to use [FromBody] before our parameters and ModelState
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration configuration, IMapper mapper)
        {
            _repo = repo;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDTO userForRegisterDTO)
        {


            userForRegisterDTO.UserName = userForRegisterDTO.UserName.ToLower();
            if (await _repo.UserExists(userForRegisterDTO.UserName))
                return BadRequest();

            var toBeCreatedUser = new User
            {
                Username = userForRegisterDTO.UserName
            };
            toBeCreatedUser = await _repo.Register(toBeCreatedUser, userForRegisterDTO.Password);

            return StatusCode(201);

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO userForLoginDTO)
        {
            try
            {
                var user = await _repo.Login(userForLoginDTO.UserName.ToLower(), userForLoginDTO.Password);

                if (user == null)
                    return Unauthorized();

                //to create the token we need to first create our claims ,then get the key from appsettings ,then create our credintials using
                //the key and algorithim we want then we create a token descriptor and specify when we want it to expire ,its subject(claims) and credintials
                //then create a token handler which we use to create the token and write it 
                var claims = new[] {

                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.Username.ToLower())

                };
                //getting the key from appsettings.json which is why I injected the configuration 
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Appsettings:Token").Value));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                var tokenDescriptor = new SecurityTokenDescriptor
                {

                    Expires = DateTime.Now.AddHours(4),
                    Subject = new ClaimsIdentity(claims),
                    SigningCredentials = credentials

                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var userToReturn = _mapper.Map<UserToReturnDTO>(user);
                return Ok(new
                {
                    token = tokenHandler.WriteToken(token),
                    info = userToReturn
                });
            }
            catch (Exception e)
            { return StatusCode(400, e.Message); }




        }
    }
}