using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBalanceAndIsDeletedToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
            name: "Balance",
            table: "Users",
            type: "decimal(18,2)",
            nullable: false,
            defaultValue: 0m);

        migrationBuilder.AddColumn<bool>(
            name: "IsDeleted",
            table: "Users",
            type: "bit",
            nullable: false,
            defaultValue: false);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
            name: "Balance",
            table: "Users");

        migrationBuilder.DropColumn(
            name: "IsDeleted",
            table: "Users");

        }
    }
}
