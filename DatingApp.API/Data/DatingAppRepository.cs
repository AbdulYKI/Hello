using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingAppRepository : IDatingAppRepository
    {
        private readonly DataContext _context;
        public DatingAppRepository(DataContext context)
        {
            _context = context;
        }



        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(U => U.Id == id);
            return user;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photo.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }
        public async Task<PagedList<User>> GetUsers(UsersListPagingParams usersListPagingParams)
        {
            var minDoB = System.DateTime.Today.AddYears(-usersListPagingParams.MaxAge);
            var maxDob = System.DateTime.Today.AddYears(-usersListPagingParams.MinAge);

            var users = _context.Users.Include(p => p.Photos).Where((u) => u.Id != usersListPagingParams.UserId &&
                                                                     u.Gender == usersListPagingParams.Gender &&
                                                                     u.DateOfBirth >= minDoB &&
                                                                     u.DateOfBirth <= maxDob);

            switch (usersListPagingParams.OrderBy)
            {
                case OrderBy.ACTIVE:
                    users = users.OrderByDescending((u) => u.LastActive);
                    break;
                case OrderBy.CREATED:
                    users = users.OrderByDescending((u) => u.Created);
                    break;
            }
            return await PagedList<User>.CreateAsync(users, usersListPagingParams.PageNumber, usersListPagingParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetMainPhotoForUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            var photo = user.Photos.FirstOrDefault(p => p.IsMain);
            return photo;


        }
    }
}