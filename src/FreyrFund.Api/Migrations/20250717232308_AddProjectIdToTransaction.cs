using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectIdToTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Transactions",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Transactions");
        }
    }
}
