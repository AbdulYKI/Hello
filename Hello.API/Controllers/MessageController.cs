using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Hello.API.Data;
using Hello.API.DTOs;
using Hello.API.Helpers;
using Hello.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hello.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/user/{userId}/[controller]")]
    [ApiController]

    public class MessageController : ControllerBase
    {
        public MessageController(IHelloRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        private readonly IHelloRepository _repo;
        private readonly IMapper _mapper;

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
                return BadRequest("Message not found");
            var messageToReturn = _mapper.Map<MessageToReturnDTO>(messageFromRepo);
            return Ok(messageToReturn);

        }
        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messagesThread = await _repo.GetMessagesThread(userId, recipientId);

            var messagesToReturnDTO = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesThread);
            return Ok(messagesToReturnDTO);

        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(int userId, MessageForSendingDTO messageDTO)
        {
            var sender = await _repo.GetUser(userId);
            if (sender == null || sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageDTO.SenderId = userId;
            var recipientUser = await _repo.GetUser(messageDTO.RecipientId);
            if (recipientUser == null)
                return BadRequest("recipient not found");
            var message = _mapper.Map<Message>(messageDTO);
            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageToReturnDTO>(message);
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToReturn); ;
            }

            throw new Exception("Failed to send message");
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(int userId, [FromQuery] MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageParams.UserId = userId;
            var messages = await _repo.GetMessagesForUser(messageParams);
            var messageToReturnDTOs = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messages);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok(messageToReturnDTOs);
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
                return BadRequest("Message not found.");
            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete(messageFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("An error occured in deleting message");



        }
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
                return BadRequest("Message not found.");

            if (userId != messageFromRepo.RecipientId)
                return Unauthorized();

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.UtcNow;
            await _repo.SaveAll();
            return NoContent();


        }
    }

}