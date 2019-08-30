using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
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
        public async Task<IActionResult> GetUsers([FromQuery] UsersListPagingParams usersListPagingParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            usersListPagingParams.UserId = userId;
            var userFromRepo = await _repo.GetUser(userId);
            if (string.IsNullOrEmpty(usersListPagingParams.Gender))
            {
                usersListPagingParams.Gender = (userFromRepo.Gender == "female") ? "male" : "female";
            }
            var users = await _repo.GetUsers(usersListPagingParams);
            var userDTOs = _mapper.Map<IEnumerable<UserForListDTO>>(users);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(userDTOs);
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
        [HttpPost("{id}/likes/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            if (await _repo.GetLike(id, recipientId) != null)
                return BadRequest("You already Like the user");

            if (await _repo.GetUser(recipientId) == null)
                return NotFound();

            var like = new Like
            {
                LikerId = id,
                LikeeId = recipientId

            };

            _repo.Add(like);
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest("Saving failed");

        }
    }
}