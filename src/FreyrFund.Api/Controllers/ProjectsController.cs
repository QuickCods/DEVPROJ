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
        /*[HttpGet]
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
        }*/
        [HttpGet]
        public async Task<ActionResult<PagedResponse<ProjectViewDto>>> GetProjects(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var query = _db.Projects.AsQueryable();

            // Filtro de pesquisa
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Title.Contains(search) || p.Description.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var projects = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProjectViewDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Rate = p.Rate,
                    Term = p.Term,
                    Target = p.Target,
                    Funded = p.Funded,
                    Risk = p.Risk,
                    RiskDescription = GetRiskDescription(p.Risk),
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    FundingPercentage = p.Target > 0 ? Math.Round((p.Funded / p.Target) * 100, 2) : 0,
                    RemainingAmount = p.Target - p.Funded,
                    IsFullyFunded = p.Funded >= p.Target
                })
                .ToListAsync();

            var response = new PagedResponse<ProjectViewDto>
            {
                Data = projects,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };

            return Ok(response);
        }


        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProject(int id)
        {
            var project = await _db.Projects
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description, //novo
                    Rate = p.Rate,
                    Term = p.Term,
                    Target = p.Target,
                    Funded = p.Funded,
                    RemainingAmount = p.Target - p.Funded,
                    FundingPercentage = p.Target > 0 ? Math.Round((p.Funded / p.Target) * 100, 2) : 0,
                    IsFullyFunded = p.Funded >= p.Target,
                    Risk = p.Risk, //novo
                    RiskDescription = GetRiskDescription(p.Risk), //novo
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
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
        
        private static string GetRiskDescription(RiskLevel risk)
        {
            return risk switch
            {
                RiskLevel.A => "Seguro",
                RiskLevel.B => "Mais ou menos",
                RiskLevel.C => "Inseguro",
                _ => "Desconhecido"
            };
        }
    }

    public class PagedResponse<T>
    {
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
 
    public class UpdateFundingRequest
    {
        public decimal Amount { get; set; }
    }
}