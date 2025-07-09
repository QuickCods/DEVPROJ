using Microsoft.EntityFrameworkCore;
using FreyrFund.Server.Models;

namespace FreyrFund.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){ }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Investment> Investments { get; set; }
    }
}