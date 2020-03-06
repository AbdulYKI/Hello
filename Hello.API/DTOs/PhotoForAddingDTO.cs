using System;
using Microsoft.AspNetCore.Http;

namespace Hello.API.DTOs
{
    public class PhotoForAddingDTO
    {
        public string Url { get; set; }
        public string Description { get; set; }
        public string PublicId { get; set; }
        public IFormFile File { get; set; }
        public DateTime DateAdded { get; set; }
        public PhotoForAddingDTO()
        {
            DateAdded = DateTime.UtcNow;
        }
    }
}