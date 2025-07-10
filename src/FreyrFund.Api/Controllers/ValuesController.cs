using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ValuesController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var user = User.Identity?.Name;
        return Ok(new { message = $"Olá, {user}! Este endpoint é protegido." });
    }
}