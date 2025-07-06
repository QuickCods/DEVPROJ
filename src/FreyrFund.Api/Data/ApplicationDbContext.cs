using Microsoft.EntityFrameworkCore;
using FreyrFund.Api.Models;

namespace FreyrFund.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da entidade Project
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Rate).HasPrecision(5, 2);
                entity.Property(e => e.Target).HasPrecision(18, 2);
                entity.Property(e => e.Funded).HasPrecision(18, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Seed data
            modelBuilder.Entity<Project>().HasData(
                new Project
                {
                    Id = 1,
                    Title = "Expansão da Rede de Energia Solar",
                    Rate = 8.5m,
                    Term = 24,
                    Target = 500000m,
                    Funded = 125000m,
                    CreatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc)
                },
                new Project
                {
                    Id = 2,
                    Title = "Desenvolvimento de App Fintech",
                    Rate = 12.0m,
                    Term = 18,
                    Target = 250000m,
                    Funded = 180000m,
                    CreatedAt = new DateTime(2024, 2, 10, 14, 30, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 2, 10, 14, 30, 0, DateTimeKind.Utc)
                },
                new Project
                {
                    Id = 3,
                    Title = "Modernização Industrial",
                    Rate = 6.8m,
                    Term = 36,
                    Target = 1000000m,
                    Funded = 750000m,
                    CreatedAt = new DateTime(2024, 3, 5, 9, 15, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 3, 5, 9, 15, 0, DateTimeKind.Utc)
                },
                new Project
                {
                    Id = 4,
                    Title = "Startup de E-commerce",
                    Rate = 15.2m,
                    Term = 12,
                    Target = 150000m,
                    Funded = 25000m,
                    CreatedAt = new DateTime(2024, 4, 20, 16, 45, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 4, 20, 16, 45, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
