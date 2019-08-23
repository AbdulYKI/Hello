using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public UserController(IDatingAppRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        private readonly IDatingAppRepository _repo;
        private readonly IMapper _mapper;

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {

            var users = await _repo.GetUsers();
            var usersDTO = _mapper.Map<IEnumerable<UserForListDTO>>(users);

            return Ok(usersDTO);
        }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userDTO = _mapper.Map<UserForDetailedDTO>(user);
            return Ok(userDTO);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForEditDTO userForEditDTO)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForEditDTO, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Updating Failed");

        }
    }
}