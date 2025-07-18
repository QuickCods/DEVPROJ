using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    [HttpPost("imagem")]
    public async Task<IActionResult> UploadImagem(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Ficheiro inválido.");

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsDir))
            Directory.CreateDirectory(uploadsDir);

        var fileName = Path.GetFileName(file.FileName);
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"uploads/{fileName}";
        return Ok(new { imageUrl });
    }
}
