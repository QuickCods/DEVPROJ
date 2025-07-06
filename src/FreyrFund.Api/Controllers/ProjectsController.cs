using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreyrFund.Api.Data;
using FreyrFund.Api.Models;

namespace FreyrFund.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProjects()
        {
            var projects = await _context.Projects
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
            var project = await _context.Projects
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
        [HttpPut("{id}/funding")]
        public async Task<IActionResult> UpdateFunding(int id, [FromBody] UpdateFundingRequest request)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            // Validar se o valor não excede o target
            if (request.Amount <= 0)
            {
                return BadRequest("O valor deve ser positivo");
            }

            if (project.Funded + request.Amount > project.Target)
            {
                return BadRequest("O valor excede o objetivo do projeto");
            }

            project.Funded += request.Amount;
            project.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }

    public class UpdateFundingRequest
    {
        public decimal Amount { get; set; }
    }
}
