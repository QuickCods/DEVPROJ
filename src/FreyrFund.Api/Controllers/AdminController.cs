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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<IdentityUser> _userMgr;
        private readonly RoleManager<IdentityRole> _roleMgr;

        public AdminController(
            AppDbContext db,
            UserManager<IdentityUser> userMgr,
            RoleManager<IdentityRole> roleMgr)
        {
            _db = db;
            _userMgr = userMgr;
            _roleMgr = roleMgr;
        }

        

        
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var list = await _db.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.PhoneNumber,
                    u.Nif,
                    DateOfBirth = u.DateOfBirth.ToString("dd/MM/yyyy"),
                    u.Address,
                    u.Role
                })
                .ToListAsync();
            return Ok(list);
        }
        
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            var iu = new IdentityUser(dto.Email)
            {
                Email = dto.Email,
                UserName = dto.Email
            };
            var res = await _userMgr.CreateAsync(iu, dto.Password);
            if (!res.Succeeded) return BadRequest(res.Errors);

            if (!await _roleMgr.RoleExistsAsync(dto.Role))
                await _roleMgr.CreateAsync(new IdentityRole(dto.Role));
            await _userMgr.AddToRoleAsync(iu, dto.Role);

            if (!DateTime.TryParseExact(dto.DateOfBirth, "dd/MM/yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out var dob))
            {
                return BadRequest("Formato de data inválido.");
            }

            var domain = new User
            {
                IdentityUserId = iu.Id,
                FullName = dto.FullName,
                DateOfBirth = dob,
                Nif = dto.Nif,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Role = dto.Role
            };
            _db.Users.Add(domain);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsers), new { id = domain.Id }, domain);
        }
        
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            if (!DateTime.TryParseExact(dto.DateOfBirth, "dd/MM/yyyy",
                    CultureInfo.InvariantCulture, DateTimeStyles.None, out var dob))
            {
                return BadRequest("Formato de data inválido.");
            }

            user.FullName = dto.FullName;
            user.DateOfBirth = dob;
            user.Nif = dto.Nif;
            user.Address = dto.Address;
            user.PhoneNumber = dto.PhoneNumber;
            user.Role = dto.Role;

            await _db.SaveChangesAsync();
            return NoContent();
        }
        
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // 1) Procura o perfil de domínio
            var domain = await _db.Users.FindAsync(id);
            if (domain == null)
                return NotFound($"Usuário de domínio com id={id} não encontrado.");

            // 2) Remove o perfil de domínio primeiro
            _db.Users.Remove(domain);
            await _db.SaveChangesAsync();

            // 3) Depois busca e remove o IdentityUser
            var iu = await _userMgr.FindByIdAsync(domain.IdentityUserId);
            if (iu != null)
                await _userMgr.DeleteAsync(iu);

            // 4) Retorna No Content
            return NoContent();
        }
        
        [HttpGet("projects")]
        public async Task<ActionResult<IEnumerable<ProjectViewDto>>> GetProjects()
        {
            var list = await _db.Projects.ToListAsync();

            var result = list.Select(p => new ProjectViewDto {
                Id = p.Id,
                Title = p.Title,
                Rate = p.Rate,
                Term = p.Term,
                Target = p.Target,
                Funded = p.Funded,
                FundingPercentage = p.Target == 0 ? 0 : Math.Round((p.Funded / p.Target) * 100, 2),
                RemainingAmount = p.Target - p.Funded,
                IsFullyFunded = p.Funded >= p.Target,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                Risk = p.Risk,
                RiskDescription = p.Risk == RiskLevel.A ? "Seguro"
                                : p.Risk == RiskLevel.B ? "Mais ou menos"
                                : "Inseguro",
                Description = p.Description
            }).ToList();

            return Ok(result);

        }

        [HttpGet("projects/{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var p = await _db.Projects.FindAsync(id);
            if (p == null) return NotFound();

            var dto = new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Rate = p.Rate,
                Term = p.Term,
                Target = p.Target,
                Funded = p.Funded,
                Description = p.Description,
                Risk = p.Risk
            };

            return Ok(dto);
        }

        [HttpPost("projects")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var p = new FreyrFund.Server.Models.Project
            {
                Title = dto.Title,
                Target = dto.Target,
                Funded = dto.Funded,
                Rate = dto.Rate,
                Term = dto.Term,
                Description = dto.Description,
                Risk = dto.Risk
            };
            _db.Projects.Add(p);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = p.Id }, dto);
        }


        [HttpPut("projects/{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var p = await _db.Projects.FindAsync(id);
            if (p == null) return NotFound();

            p.Title = dto.Title;
            p.Target = dto.Target;
            p.Funded = dto.Funded;
            p.Rate = dto.Rate;
            p.Term = dto.Term;
            p.Description = dto.Description;
            p.Risk = dto.Risk;

            await _db.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("projects/{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var p = await _db.Projects.FindAsync(id);
            if (p == null) return NotFound();
            _db.Projects.Remove(p);
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }
}
