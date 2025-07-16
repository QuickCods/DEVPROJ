using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/[controller]")]
public class ExportController : ControllerBase
{
    private readonly ExcelExportService _excelExportService;

    public ExportController(ExcelExportService excelExportService)
    {
        _excelExportService = excelExportService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> ExportAll()
    {
        var excelBytes = await _excelExportService.ExportAllAsync();
        var fileName = $"FreyrFund_Export_{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx";

        return File(excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileName);
    }
}