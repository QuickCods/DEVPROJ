using FreyrFund.Api.Models;

namespace FreyrFund.Api.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<Project>> GetAllProjectsAsync();
        Task<Project?> GetProjectByIdAsync(int id);
        Task<Project> UpdateProjectFundingAsync(int id, decimal amount);
    }
}
