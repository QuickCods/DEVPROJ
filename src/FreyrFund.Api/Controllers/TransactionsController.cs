using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreyrFund.Server.Data;
using FreyrFund.Api.Models.Dtos;
using FreyrFund.Server.Models;


namespace FreyrFund.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "User")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        [Authorize] // Opcional: se queres proteger este endpoint
        public async Task<IActionResult> GetTransactionsByUserId(int userId)
        {
            
            var transactions = await (
            from t in _context.Transactions
            where t.UserId == userId
            orderby t.Date descending
            join p in _context.Projects on t.ProjectId equals p.Id into projGroup
            from pg in projGroup.DefaultIfEmpty() // Left join para permitir ProjectId null
            select new TransactionDto
            {
                Amount = t.Amount,
                Date = t.Date,
                Type = t.Type.ToString(),
                ProjectId = t.Type == TransactionType.Investment ? t.ProjectId : null,
                ProjectTitle = t.Type == TransactionType.Investment ? pg.Title : null
            }
        ).ToListAsync();

        return Ok(transactions);
        }
    }
}