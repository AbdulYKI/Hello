using System.Collections.Generic;
using Hello.API.Models;
using Newtonsoft.Json;

namespace Hello.API.Data
{
    public class Seed
    {
        public Seed(DataContext context)
        {
            _context = context;
        }

        private readonly DataContext _context;

        public void SeedUsers()
        {

            var userData = System.IO.File.ReadAllText("Models/UserGeneratedData.json");
            List<User> users = JsonConvert.DeserializeObject<List<User>>(userData);

            foreach (var user in users)
            {
                user.Username = user.Username.ToLower();
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                _context.Users.Add(user);

            }
            _context.SaveChanges();
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        public void SeedCountries()
        {

            var countriesData = System.IO.File.ReadAllText("Models/Countries.json");
            List<Country> countries = JsonConvert.DeserializeObject<List<Country>>(countriesData);

            foreach (var country in countries)
                _context.Countries.Add(country);


            _context.SaveChanges();
        }
    }
}