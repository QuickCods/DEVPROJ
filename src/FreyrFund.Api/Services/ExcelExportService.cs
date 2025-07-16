using OfficeOpenXml;
using System.IO;
using Microsoft.EntityFrameworkCore;
using FreyrFund.Server.Data;
using FreyrFund.Server.Models;


public class ExcelExportService
{
    private readonly AppDbContext _context;

    public ExcelExportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]> ExportAllAsync()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        using var package = new ExcelPackage();

        await AddUsersSheet(package);
        await AddProjectsSheet(package);
        await AddInvestmentsSheet(package);
        await AddTransactionsSheet(package);
        await AddKpiSheet(package);

        return package.GetAsByteArray();
    }

    private async Task AddUsersSheet(ExcelPackage package)
    {
        var users = await _context.Users.ToListAsync();
        var sheet = package.Workbook.Worksheets.Add("Users");

        sheet.Cells[1, 1].Value = "ID";
        sheet.Cells[1, 2].Value = "FullName";
        sheet.Cells[1, 3].Value = "Email";
        sheet.Cells[1, 4].Value = "Phone";
        sheet.Cells[1, 5].Value = "NIF";
        sheet.Cells[1, 6].Value = "Balance";

        for (int i = 0; i < users.Count; i++)
        {
            var u = users[i];
            sheet.Cells[i + 2, 1].Value = u.Id;
            sheet.Cells[i + 2, 2].Value = u.FullName;
            sheet.Cells[i + 2, 3].Value = u.Email;
            sheet.Cells[i + 2, 4].Value = u.PhoneNumber;
            sheet.Cells[i + 2, 5].Value = u.Nif;
            sheet.Cells[i + 2, 6].Value = u.Balance;
        }
    }

    private async Task AddProjectsSheet(ExcelPackage package)
    {
        var projects = await _context.Projects.ToListAsync();
        var sheet = package.Workbook.Worksheets.Add("Projects");

        sheet.Cells[1, 1].Value = "ID";
        sheet.Cells[1, 2].Value = "Title";
        sheet.Cells[1, 3].Value = "Rate";
        sheet.Cells[1, 4].Value = "Term";
        sheet.Cells[1, 5].Value = "Target";
        sheet.Cells[1, 6].Value = "Funded";
        sheet.Cells[1, 7].Value = "CreatedAt";

        for (int i = 0; i < projects.Count; i++)
        {
            var p = projects[i];
            sheet.Cells[i + 2, 1].Value = p.Id;
            sheet.Cells[i + 2, 2].Value = p.Title;
            sheet.Cells[i + 2, 3].Value = p.Rate;
            sheet.Cells[i + 2, 4].Value = p.Term;
            sheet.Cells[i + 2, 5].Value = p.Target;
            sheet.Cells[i + 2, 6].Value = p.Funded;
            sheet.Cells[i + 2, 7].Value = p.CreatedAt.ToString("yyyy-MM-dd");
        }
    }

    private async Task AddInvestmentsSheet(ExcelPackage package)
    {
        var investments = await _context.Investments
            .Include(i => i.User)
            .Include(i => i.Project)
            .ToListAsync();

        var sheet = package.Workbook.Worksheets.Add("Investments");

        sheet.Cells[1, 1].Value = "ID";
        sheet.Cells[1, 2].Value = "User";
        sheet.Cells[1, 3].Value = "Project";
        sheet.Cells[1, 4].Value = "Amount";
        sheet.Cells[1, 5].Value = "Date";

        for (int i = 0; i < investments.Count; i++)
        {
            var inv = investments[i];
            sheet.Cells[i + 2, 1].Value = inv.Id;
            sheet.Cells[i + 2, 2].Value = inv.User?.FullName;
            sheet.Cells[i + 2, 3].Value = inv.Project?.Title;
            sheet.Cells[i + 2, 4].Value = inv.Amount;
            sheet.Cells[i + 2, 5].Value = inv.Date.ToString("yyyy-MM-dd");
        }
    }

    private async Task AddTransactionsSheet(ExcelPackage package)
    {
        var txs = await _context.Transactions
            .Include(t => t.User)
            .ToListAsync();

        var sheet = package.Workbook.Worksheets.Add("Transactions");

        sheet.Cells[1, 1].Value = "ID";
        sheet.Cells[1, 2].Value = "User";
        sheet.Cells[1, 3].Value = "Amount";
        sheet.Cells[1, 4].Value = "Type";
        sheet.Cells[1, 5].Value = "Date";

        for (int i = 0; i < txs.Count; i++)
        {
            var t = txs[i];
            sheet.Cells[i + 2, 1].Value = t.Id;
            sheet.Cells[i + 2, 2].Value = t.User?.FullName;
            sheet.Cells[i + 2, 3].Value = t.Amount;
            sheet.Cells[i + 2, 4].Value = t.Type.ToString();
            sheet.Cells[i + 2, 5].Value = t.Date.ToString("yyyy-MM-dd");
        }
    }

    private async Task AddKpiSheet(ExcelPackage package)
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalProjects = await _context.Projects.CountAsync();
        var totalFunded = await _context.Projects.SumAsync(p => p.Funded);
        var totalInvestments = await _context.Investments.SumAsync(i => i.Amount);

        var sheet = package.Workbook.Worksheets.Add("KPIs");

        sheet.Cells[1, 1].Value = "Métrica";
        sheet.Cells[1, 2].Value = "Valor";

        sheet.Cells[2, 1].Value = "Total de Utilizadores";
        sheet.Cells[2, 2].Value = totalUsers;

        sheet.Cells[3, 1].Value = "Total de Projetos";
        sheet.Cells[3, 2].Value = totalProjects;

        sheet.Cells[4, 1].Value = "Total Investido";
        sheet.Cells[4, 2].Value = totalInvestments;

        sheet.Cells[5, 1].Value = "Total Funded em Projetos";
        sheet.Cells[5, 2].Value = totalFunded;
    }
}