using System.ComponentModel.DataAnnotations;

namespace Hello.API.DTOs
{
    public class UserForEditDTO
    {
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
    }
}