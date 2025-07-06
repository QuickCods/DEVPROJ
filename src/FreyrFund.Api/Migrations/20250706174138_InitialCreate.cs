using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    Term = table.Column<int>(type: "int", nullable: false),
                    Target = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Funded = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "CreatedAt", "Funded", "Rate", "Target", "Term", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 15, 10, 0, 0, 0, DateTimeKind.Utc), 125000m, 8.5m, 500000m, 24, "Expansão da Rede de Energia Solar", new DateTime(2024, 1, 15, 10, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2024, 2, 10, 14, 30, 0, 0, DateTimeKind.Utc), 180000m, 12.0m, 250000m, 18, "Desenvolvimento de App Fintech", new DateTime(2024, 2, 10, 14, 30, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2024, 3, 5, 9, 15, 0, 0, DateTimeKind.Utc), 750000m, 6.8m, 1000000m, 36, "Modernização Industrial", new DateTime(2024, 3, 5, 9, 15, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2024, 4, 20, 16, 45, 0, 0, DateTimeKind.Utc), 25000m, 15.2m, 150000m, 12, "Startup de E-commerce", new DateTime(2024, 4, 20, 16, 45, 0, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
