using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FreyrFund.Server.Models;
using FreyrFund.Server.Data;
using FreyrFund.Api.Models.Dtos;

namespace FreyrFund.Server.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> TopUpAsync(int userId, decimal amount)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted) return false;

            user.Balance += amount;
            _context.Transactions.Add(new Transaction
            {
                UserId = user.Id,
                Amount = amount,
                Date = DateTime.UtcNow,
                Type = TransactionType.TopUp
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> WithdrawAsync(int userId, decimal amount)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted || user.Balance < amount) return false;

            user.Balance -= amount;
            _context.Transactions.Add(new Transaction
            {
                UserId = user.Id,
                Amount = -amount,
                Date = DateTime.UtcNow,
                Type = TransactionType.Withdrawal
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAccountAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> GetBalanceAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.Balance ?? 0;
        }

        public async Task<List<TransactionDto>> GetPortfolioAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.IsDeleted) return new List<TransactionDto>();

            var transactions = await _context.Transactions
                .Where(t => t.UserId == user.Id)
                .OrderByDescending(t => t.Date)
                .Select(t => new TransactionDto
                {
                    Amount = t.Amount,
                    Date = t.Date,
                    Type = t.Type.ToString()
                })
                .ToListAsync();

            return transactions;
        }
        
        /*public async Task<bool> InvestAsync(int userId, int projectId, decimal amount)
        {
            var user = await _context.Users.FindAsync(userId);
            var project = await _context.Projects.FindAsync(projectId);

            if (user == null || user.IsDeleted || project == null) return false;
            if (user.Balance < amount) return false;

            user.Balance -= amount;

            _context.Investments.Add(new Investment
            {
                UserId = userId,
                ProjectId = projectId,
                Amount = amount,
                Date = DateTime.UtcNow
            });

            _context.Transactions.Add(new Transaction
            {
                UserId = user.Id,
                Amount = -amount,
                Date = DateTime.UtcNow,
                Type = TransactionType.Investment
            });

            await _context.SaveChangesAsync();
            return true;
        }*/


    }

}