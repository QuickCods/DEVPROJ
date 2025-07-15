using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class LinkUserToIdentityUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Cria índice único sobre IdentityUserId
        migrationBuilder.CreateIndex(
            name: "IX_Users_IdentityUserId",
            table: "Users",
            column: "IdentityUserId",
            unique: true);

        // Cria a foreign key Users.IdentityUserId → AspNetUsers.Id
        migrationBuilder.AddForeignKey(
            name: "FK_Users_AspNetUsers_IdentityUserId",
            table: "Users",
            column: "IdentityUserId",
            principalTable: "AspNetUsers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Desfaz o FK
    migrationBuilder.DropForeignKey(
            name: "FK_Users_AspNetUsers_IdentityUserId",
            table: "Users");

        // Remove o índice
        migrationBuilder.DropIndex(
            name: "IX_Users_IdentityUserId",
            table: "Users");
        }
    }
}
