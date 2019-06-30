using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class UserForRegisterDTO
    {   [Required]
          public string UserName { get; set; }
        [Required]
        [StringLength(10,MinimumLength=5,ErrorMessage="Password length should be between 5 and 10" ) ]
     public string Password { get; set; }
    }
}