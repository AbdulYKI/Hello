using System.Collections.Generic;

namespace Hello.API.Models
{
    public class Country
    {
        public int NumericCode { get; set; }
        public string Name { get; set; }
        public string Alpha2Code { get; set; }
        public ICollection<User> Users { get; set; }
    }
}