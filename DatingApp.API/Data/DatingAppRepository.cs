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
            var user = await _context
            .Users
            .Include(p => p.Photos)
            .Include(l => l.Likees)
            .Include(c => c.Country)
            .FirstOrDefaultAsync(U => U.Id == id);
            return user;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }
        public async Task<PagedList<User>> GetUsers(UsersListPagingParams usersListPagingParams)
        {
            var minDoB = System.DateTime.Today.AddYears(-usersListPagingParams.MaxAge);
            var maxDob = System.DateTime.Today.AddYears(-usersListPagingParams.MinAge);

            var users = _context.Users
            .Include(p => p.Photos)
            .Where((u) => u.Id != usersListPagingParams.UserId &&
                                 u.Gender == usersListPagingParams.Gender &&
                                 u.DateOfBirth >= minDoB &&
                                 u.DateOfBirth <= maxDob);


            if (usersListPagingParams.Bring == Bring.LIKERS)
            {
                var likersIds = _context.Likes
                .Where((l) => l.LikeeId == usersListPagingParams.UserId)
                .Select((l) => l.LikerId);
                users = users.Where((u) => likersIds.Contains(u.Id));

            }
            else if (usersListPagingParams.Bring == Bring.LIKEES)
            {

                var likeesIds = _context.Likes
                .Where((l) => l.LikerId == usersListPagingParams.UserId)
                .Select((l) => l.LikeeId);
                users = users.Where((u) => likeesIds.Contains(u.Id));
            }

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

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(L => L.LikerId == userId && L.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Meessages.Include(m => m.Sender).ThenInclude(s => s.Photos).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Message>> GetMessagesThread(int userId, int recipientId)
        {
            var messages = await _context.Meessages
            .Include(m => m.Sender)
            .ThenInclude(p => p.Photos)
            .Include(m => m.Recipient)
            .OrderBy(message => message.MessageSent)
            .Where(m => (!m.RecipientDeleted && m.RecipientId == userId && m.SenderId == recipientId) ||
                    (!m.SenderDeleted && m.SenderId == userId && m.RecipientId == recipientId))
             .ToListAsync();
            return messages;
        }


        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Meessages
            .Include(m => m.Sender)
            .ThenInclude(p => p.Photos)
            .Include(m => m.Recipient)
            .ThenInclude(p => p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case Container.INBOX:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && !m.RecipientDeleted);
                    break;
                case Container.OUTBOX:
                    messages = messages.Where(m => m.SenderId == messageParams.UserId && !m.SenderDeleted);
                    break;
                case Container.UNREAD:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && !m.IsRead && !m.RecipientDeleted);
                    break;
            }
            messages = messages.OrderByDescending(m => m.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }
    }
}