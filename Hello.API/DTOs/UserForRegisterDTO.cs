using System;
using System.ComponentModel.DataAnnotations;
using Hello.API.Helpers;

namespace Hello.API.DTOs
{
    public class UserForRegisterDTO
    {
        [Required]

        public string Username { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 5, ErrorMessage = "Password length should be between 5 and 10")]

        public string Password { get; set; }
        [Required]
        public int CountryNumericCode { get; set; }

        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        [CustomValidation(typeof(UserForRegisterDTO), "ValidateAge")]
        public DateTime DateOfBirth { get; set; }
        public static ValidationResult ValidateAge(DateTime dateOfBirth, ValidationContext context)
        {
            var age = dateOfBirth.CalculateAge();

            return (age < 18)
                ? new ValidationResult(null)
                : ValidationResult.Success;
        }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public UserForRegisterDTO()
        {
            LastActive = DateTime.UtcNow;
            Created = DateTime.UtcNow;
        }
    }
}