using System.Collections.Generic;
using System.Threading.Tasks;
using Hello.API.Helpers;
using Hello.API.Models;

namespace Hello.API.Data
{
    public interface IHelloRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<User> GetUser(int id);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int id);
        Task<PagedList<User>> GetUsers(UsersListPagingParams usersListPagingParams);
        Task<bool> SaveAll();
        Task<Message> GetMessage(int id);
        Task<IEnumerable<Message>> GetMessagesThread(int userId, int recipientId);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);

    }
}