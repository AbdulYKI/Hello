using System;

namespace Hello.API.DTOs
{
    public class MessageForSendingDTO
    {
        public int SenderId { get; set; }



        public int RecipientId { get; set; }



        public string Content { get; set; }



        public DateTime MessageSent { get; set; }


        public MessageForSendingDTO()
        {
            MessageSent = DateTime.UtcNow;

        }
    }
}