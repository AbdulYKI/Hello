using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        //should be photos but SQLITE is a pain in the neck to deal with
        public DbSet<Photo> Photo { get; set; }
        public DbSet<Like> Likes { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //tell EF what is the primary key
            modelBuilder.Entity<Like>()
            .HasKey(k => new { k.LikerId, k.LikeeId });


            //explains the relationship between the likee in the likes table and the likers in the user table
            modelBuilder.Entity<Like>()
            .HasOne(k => k.Likee)
            .WithMany(u => u.Likers)
            .OnDelete(DeleteBehavior.Restrict);

            //explains the relationship between the liker in the likes table and the likees in the user table
            modelBuilder.Entity<Like>()
            .HasOne(k => k.Liker)
            .WithMany(u => u.Likees)
            .OnDelete(DeleteBehavior.Restrict);


        }
    }
}
