using FreyrFund.Api.Models;

namespace FreyrFund.Api.Services
{
    public class InMemoryProjectService : IProjectService
    {
        private readonly List<Project> _projects;

        public InMemoryProjectService()
        {
            _projects = SeedProjects();
        }

        public Task<IEnumerable<Project>> GetAllProjectsAsync()
        {
            return Task.FromResult(_projects.AsEnumerable());
        }

        public Task<Project?> GetProjectByIdAsync(int id)
        {
            var project = _projects.FirstOrDefault(p => p.Id == id);
            return Task.FromResult(project);
        }

        public Task<Project> UpdateProjectFundingAsync(int id, decimal amount)
        {
            var project = _projects.FirstOrDefault(p => p.Id == id);
            if (project == null)
            {
                throw new ArgumentException($"Project with ID {id} not found");
            }

            project.Funded += amount;
            project.UpdatedAt = DateTime.UtcNow;

            return Task.FromResult(project);
        }

        private List<Project> SeedProjects()
        {
            return new List<Project>
            {
                new Project
                {
                    Id = 1,
                    Title = "Energia Solar Residencial",
                    Rate = 8.5m,
                    Term = 24,
                    Target = 150000m,
                    Funded = 45000m,
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Project
                {
                    Id = 2,
                    Title = "Expansão de Restaurante",
                    Rate = 12.0m,
                    Term = 18,
                    Target = 80000m,
                    Funded = 20000m,
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Project
                {
                    Id = 3,
                    Title = "Startup de Tecnologia",
                    Rate = 15.5m,
                    Term = 36,
                    Target = 500000m,
                    Funded = 125000m,
                    CreatedAt = DateTime.UtcNow.AddDays(-45),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Project
                {
                    Id = 4,
                    Title = "Agricultura Sustentável",
                    Rate = 9.2m,
                    Term = 30,
                    Target = 200000m,
                    Funded = 180000m,
                    CreatedAt = DateTime.UtcNow.AddDays(-60),
                    UpdatedAt = DateTime.UtcNow.AddHours(-6)
                }
            };
        }
    }
}
