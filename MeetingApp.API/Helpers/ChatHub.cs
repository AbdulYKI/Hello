using System;
using System.Threading.Tasks;
using DatingApp.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.API.Helpers

{
    [Authorize]
    public class ChatHub : Hub
    {
        public void SendChatMessage(MessageToReturnDTO message)
        {
            string name = Context.User.Identity.Name;
            object[] args = { message };

            Clients.Group(message.RecipientId.ToString()).SendCoreAsync("recieveMessage", args);

        }

        public async Task JoinRoom(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
        public async Task LeaveRoom(string userId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }
        public void NotifySender(string messageId, string recipientId)
        {
            var notification = new { id = Int64.Parse(messageId), dateRead = DateTime.Now };
            object[] args = { notification };
            Clients.Group(recipientId).SendCoreAsync("recieveNotification", args);
        }

    }
}