using FreyrFund.Server.Models;

namespace FreyrFund.Server.Services
{
    public interface IUserService
    {
        Task<bool> TopUpAsync(int userId, decimal amount);
        Task<bool> WithdrawAsync(int userId, decimal amount);
        Task<bool> DeleteAccountAsync(int userId);
        Task<decimal> GetBalanceAsync(int userId);
        Task<List<Transaction>> GetPortfolioAsync(int userId);
        Task<bool> InvestAsync(int userId, int projectId, decimal amount);
    }

}