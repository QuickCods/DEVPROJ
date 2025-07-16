using Microsoft.EntityFrameworkCore;
using FreyrFund.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace FreyrFund.Server.Data
{
    public class AppDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Transaction> Transactions { get; set; }  //adicionado novo

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            // Configura 1:1 IdentityUser ↔ User
            builder.Entity<User>()
                .HasOne(u => u.IdentityUser)
                .WithOne()
                .HasForeignKey<User>(u => u.IdentityUserId)
                .IsRequired();
            builder.Entity<Transaction>().ToTable("Transactions");
        }
    }
}
