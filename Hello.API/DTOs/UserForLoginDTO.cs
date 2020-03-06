using System.ComponentModel.DataAnnotations;

namespace Hello.API.DTOs
{
    public class UserForLoginDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}