using System.Collections.Generic;
using System.Threading.Tasks;
using Hello.API.Models;

namespace Hello.API.Data
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string userName, string password);
        Task<bool> UserExists(string userName);
        Task<List<Country>> GetCountries();
    }

}