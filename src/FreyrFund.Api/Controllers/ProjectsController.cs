using System.Globalization;
using FreyrFund.Api.Models.Dtos;
using FreyrFund.Server.Data;
using FreyrFund.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FreyrFund.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "User")]
   
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProjectsController(AppDbContext db)
        {
            _db = db;
        }


        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProjects()
        {
            var projects = await _db.Projects
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Rate,
                    p.Term,
                    p.Target,
                    p.Funded,
                    FundingPercentage = p.Target > 0 ? Math.Round((p.Funded / p.Target) * 100, 2) : 0,
                    RemainingAmount = p.Target - p.Funded,
                    IsFullyFunded = p.Funded >= p.Target,
                    p.CreatedAt,
                    p.UpdatedAt
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProject(int id)
        {
            var project = await _db.Projects
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Rate,
                    p.Term,
                    p.Target,
                    p.Funded,
                    FundingPercentage = p.Target > 0 ? Math.Round((p.Funded / p.Target) * 100, 2) : 0,
                    RemainingAmount = p.Target - p.Funded,
                    IsFullyFunded = p.Funded >= p.Target,
                    p.CreatedAt,
                    p.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        // PUT: api/projects/5/funding
        [HttpPost("{id}/invest")]
        public async Task<IActionResult> InvestInProject(int id, [FromBody] InvestmentRequestDto request)
        {
            var project = await _db.Projects.FindAsync(id);
            var user = await _db.Users.FindAsync(request.UserId);

            if (project == null || user == null || user.IsDeleted)
                return BadRequest("Projeto ou utilizador inválido.");

            if (request.Amount <= 0)
                return BadRequest("O valor deve ser positivo.");

            if (user.Balance < request.Amount)
                return BadRequest("Saldo insuficiente.");

            if (project.Funded + request.Amount > project.Target)
                return BadRequest("O valor excede o objetivo do projeto.");

            // Atualizações
            user.Balance -= request.Amount;
            project.Funded += request.Amount;
            project.UpdatedAt = DateTime.UtcNow;

            _db.Investments.Add(new Investment
            {
                UserId = user.Id,
                ProjectId = project.Id,
                Amount = request.Amount,
                Date = DateTime.UtcNow
            });

            _db.Transactions.Add(new Transaction
            {
                UserId = user.Id,
                Amount = -request.Amount,
                Date = DateTime.UtcNow,
                Type = TransactionType.Investment
            });

            await _db.SaveChangesAsync();
            return Ok(new { message = "Investimento realizado com sucesso." });
        }

        private bool ProjectExists(int id)
        {
            return _db.Projects.Any(e => e.Id == id);
        }
    }
 
    public class UpdateFundingRequest
    {
        public decimal Amount { get; set; }
    }
}