using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class UserForRegisterDTO
    {
        [Required]

        public string Username { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 5, ErrorMessage = "Password length should be between 5 and 10")]

        public string Password { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }

        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public UserForRegisterDTO()
        {
            LastActive = DateTime.UtcNow;
            Created = DateTime.UtcNow;
        }
    }
}