using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameAndRestructureProjectsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1) Renomear colunas
            migrationBuilder.RenameColumn(
                name: "ReturnRate",
                table: "Projects",
                newName: "Rate");

            migrationBuilder.RenameColumn(
                name: "DurationMonths",
                table: "Projects",
                newName: "Term");

            migrationBuilder.RenameColumn(
                name: "AmountRequired",
                table: "Projects",
                newName: "Target");

            migrationBuilder.RenameColumn(
                name: "AmountFunded",
                table: "Projects",
                newName: "Funded");

            // 2) Remover coluna obsoleta
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Projects");

            // 3) Adicionar carimbos de data
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Desfazer adição de colunas de data
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Projects");

            // Recriar coluna Description
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            // Reverter renomeações
            migrationBuilder.RenameColumn(
                name: "Funded",
                table: "Projects",
                newName: "AmountFunded");

            migrationBuilder.RenameColumn(
                name: "Target",
                table: "Projects",
                newName: "AmountRequired");

            migrationBuilder.RenameColumn(
                name: "Term",
                table: "Projects",
                newName: "DurationMonths");

            migrationBuilder.RenameColumn(
                name: "Rate",
                table: "Projects",
                newName: "ReturnRate");
        }
    }
}
