using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using FreyrFund.Server.Models;
using BCrypt.Net;
using FreyrFund.Server.Data;
using Microsoft.EntityFrameworkCore;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly IDictionary<string, string> _users = new Dictionary<string, string>
    {
        { "utilizador1", "senha123" }
    };

    public AuthController(AppDbContext dbContext, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var identityUser = await _userManager.FindByEmailAsync(request.Email);
        if (identityUser == null
            || !await _userManager.CheckPasswordAsync(identityUser, request.Password))
            return Unauthorized();


        var domainUser = await _dbContext.Users
        .SingleAsync(u => u.IdentityUserId == identityUser.Id);
       
            
        var roles = await _userManager.GetRolesAsync(identityUser);
        var claims = new List<Claim> {
           
        new Claim(JwtRegisteredClaimNames.Sub, domainUser.Id.ToString()),
        new Claim("userId", domainUser.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.UniqueName, request.Email)
        
       
    };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);
        var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes),
                                                  SecurityAlgorithms.HmacSha256);

        var expiresInString = jwtSettings["ExpiresInMinutes"]
            ?? throw new InvalidOperationException("Configuração 'JwtSettings:ExpiresInMinutes' não encontrada.");

        if (!double.TryParse(expiresInString, out var expiresIn))
            throw new InvalidOperationException($"Configuração 'ExpiresInMinutes' inválida: {expiresInString}");

        var expires = DateTime.UtcNow.AddMinutes(expiresIn);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = creds
        };

        var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new { token = jwt, expires });
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            var erros = ModelState

            .Where(kvp => kvp.Value?.Errors.Count > 0)
            .Select(kvp => new
            {
                
                Campo = kvp.Key,
                
                Erros = kvp.Value!.Errors
                            .Select(e => e.ErrorMessage)
                            .ToArray()
            });

            return BadRequest(erros);
        }
        
        var formats = new[] { "d/M/yy", "dd/MM/yy", "d/M/yyyy", "dd/MM/yyyy" };
        if (!DateTime.TryParseExact(
                request.DateOfBirth,
                formats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var dob))
        {
            return BadRequest(new
            {
                DateOfBirth = "Formato inválido. Use dd/MM/aa ou dd/MM/aaaa."
            });
        }


        // Hash da password (exemplo com BCrypt)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        
        var identityUser = new IdentityUser(request.Email)
        {
            Email = request.Email,
            UserName = request.Email
        };
        var createResult = await _userManager.CreateAsync(identityUser, request.Password);
        if (!createResult.Succeeded)
            return BadRequest(createResult.Errors);

       
        await _userManager.AddToRoleAsync(identityUser, "User");

        
        var domainUser = new User
        {
            IdentityUserId = identityUser.Id,  
            FullName = request.FullName,
            DateOfBirth = dob,
            Nif = request.Nif,
            Address = request.Address,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email
        };
        _dbContext.Users.Add(domainUser);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Utilizador registado com sucesso." });
    }




    [HttpPost("seed-roles")]
    public async Task<IActionResult> SeedRoles()
    {
        string[] roles = new[] { "Admin", "User" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));
        }

        return Ok(new { seeded = roles });
    }
    

}
