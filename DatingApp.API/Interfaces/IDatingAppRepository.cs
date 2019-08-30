using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingAppRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<User> GetUser(int id);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int id);
        Task<PagedList<User>> GetUsers(UsersListPagingParams usersListPagingParams);
        Task<bool> SaveAll();

    }
}