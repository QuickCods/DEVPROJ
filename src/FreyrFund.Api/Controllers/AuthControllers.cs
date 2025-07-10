using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IDictionary<string, string> _users = new Dictionary<string, string>
    {
        { "utilizador1", "senha123" }
    };

    public AuthController(UserManager<IdentityUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {

        // 1) Validar utilizador
        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized();


        // 2) Gerar JWT
        var jwtSettings = _configuration.GetSection("JwtSettings");

        // >>> Aqui começa o trecho de validação de null <<<

        // tenta ler a chave; se não existir, lança imediatamente
        var jwtKey = jwtSettings["Key"]
                     ?? throw new InvalidOperationException("Configuração 'JwtSettings:Key' não encontrada.");

        // converte para bytes
        var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

        // cria as credenciais de assinatura
        var creds = new SigningCredentials(
            new SymmetricSecurityKey(keyBytes),
            SecurityAlgorithms.HmacSha256
        );

        // >>> aqui termina o trecho de validação <<<

        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new[] { new Claim(ClaimTypes.Name, request.Username) };
        // tenta ler o valor; se não existir, lança imediatamente
        var expiresInString = jwtSettings["ExpiresInMinutes"]
            ?? throw new InvalidOperationException("Configuração 'JwtSettings:ExpiresInMinutes' não encontrada.");

        // tenta converter para double; se falhar, lança exceção clara
        if (!double.TryParse(expiresInString, out var expiresIn))
        {
            throw new InvalidOperationException(
                $"Configuração 'JwtSettings:ExpiresInMinutes' inválida: '{expiresInString}'.");
        }

        // Calcula a expiração
        var expires = DateTime.UtcNow.AddMinutes(expiresIn);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = creds
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwt = tokenHandler.WriteToken(token);

        return Ok(new { token = jwt, expires });
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register(LoginRequest request)
    {
        var user = new IdentityUser { UserName = request.Username };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);
        return Ok();
    }
}
