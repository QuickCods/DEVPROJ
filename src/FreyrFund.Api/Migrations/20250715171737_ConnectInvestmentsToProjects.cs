using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConnectInvestmentsToProjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
    {
        // 2) Add the FK constraint
        migrationBuilder.AddForeignKey(
            name: "FK_Investments_Projects_ProjectId",
            table: "Investments",
            column: "ProjectId",
            principalTable: "Projects",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // reverse the Up() changes:
        migrationBuilder.DropForeignKey(
            name: "FK_Investments_Projects_ProjectId",
            table: "Investments");

        migrationBuilder.DropIndex(
            name: "IX_Investments_ProjectId",
            table: "Investments");
    }
    }
}
