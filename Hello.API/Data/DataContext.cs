using Hello.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Hello.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<Photo> Photos { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Meessages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //tell EF what is the primary key
            modelBuilder.Entity<Like>()
            .HasKey(k => new { k.LikerId, k.LikeeId });


            modelBuilder.Entity<Country>()
             .HasKey(k => new { k.NumericCode });

            //explains the relationship between the likee in the likes table and the likers in the user table
            modelBuilder.Entity<Like>()
            .HasOne(k => k.Likee)
            .WithMany(u => u.Likers)
             .HasForeignKey(k => k.LikeeId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                        .HasOne(m => m.Recipient)
                        .WithMany(u => u.MessagesReceived)
                        .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
            .HasOne(u => u.Country)
            .WithMany(C => C.Users)
            .OnDelete(DeleteBehavior.Restrict)
            .HasForeignKey(u => u.CountryNumericCode);
            //explains the relationship between the liker in the likes table and the likees in the user table
            modelBuilder.Entity<Like>()
            .HasOne(k => k.Liker)
            .WithMany(u => u.Likees)
             .HasForeignKey(k => k.LikerId)
            .OnDelete(DeleteBehavior.Restrict);


        }
    }
}
