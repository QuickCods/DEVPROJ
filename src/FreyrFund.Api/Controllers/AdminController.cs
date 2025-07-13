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
        private readonly AppDbContext      _db;
        private readonly UserManager<IdentityUser> _userMgr;
        private readonly RoleManager<IdentityRole> _roleMgr;

        public AdminController(
            AppDbContext db,
            UserManager<IdentityUser> userMgr,
            RoleManager<IdentityRole> roleMgr)
        {
            _db       = db;
            _userMgr  = userMgr;
            _roleMgr  = roleMgr;
        }

        // --- USUÁRIOS ---

        // GET api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var list = await _db.Users
                .Select(u => new {
                    u.Id, u.FullName, u.Email, u.PhoneNumber, u.Nif,
                    DateOfBirth = u.DateOfBirth.ToString("dd/MM/yyyy"),
                    u.Address, u.Role
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST api/admin/users
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            // 1) IdentityUser
            var iu = new IdentityUser(dto.Email) {
                Email = dto.Email,
                UserName = dto.Email
            };
            var res = await _userMgr.CreateAsync(iu, dto.Password);
            if (!res.Succeeded) return BadRequest(res.Errors);

            // 2) Role
            if (!await _roleMgr.RoleExistsAsync(dto.Role))
                await _roleMgr.CreateAsync(new IdentityRole(dto.Role));
            await _userMgr.AddToRoleAsync(iu, dto.Role);

            // 3) Perfil de domínio
            if (!DateTime.TryParseExact(dto.DateOfBirth, "dd/MM/yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None, out var dob))
            {
                return BadRequest("Formato de data inválido.");
            }

            var domain = new User {
                IdentityUserId = iu.Id,
                FullName       = dto.FullName,
                DateOfBirth    = dob,
                Nif            = dto.Nif,
                Address        = dto.Address,
                PhoneNumber    = dto.PhoneNumber,
                Email          = dto.Email,
                Role           = dto.Role
            };
            _db.Users.Add(domain);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsers), new { id = domain.Id }, domain);
        }

        // DELETE api/admin/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // 1) Busca o perfil de domínio
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


                // --- PROJETOS ---

                // GET api/admin/projects
                [HttpGet("projects")]
                public async Task<IActionResult> GetProjects()
                {
                    var list = await _db.Projects.ToListAsync();
                    return Ok(list);
                }

        // POST api/admin/projects
        [HttpPost("projects")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
        {
            var p = new FreyrFund.Server.Models.Project
            {
                Title          = dto.Title,
                Description    = dto.Description,
                AmountRequired = dto.AmountRequired,
                AmountFunded   = dto.AmountFunded,
                ReturnRate     = dto.ReturnRate,
                DurationMonths = dto.DurationMonths
            };
            _db.Projects.Add(p);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProjects), new { id = p.Id }, p);
        }

        // PUT api/admin/projects/{id}
        [HttpPut("projects/{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectDto dto)
        {
            var p = await _db.Projects.FindAsync(id);
            if (p == null) return NotFound();
            p.Title          = dto.Title;
            p.Description    = dto.Description;
            p.AmountRequired = dto.AmountRequired;
            p.AmountFunded   = dto.AmountFunded;
            p.ReturnRate     = dto.ReturnRate;
            p.DurationMonths = dto.DurationMonths;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/admin/projects/{id}]
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
