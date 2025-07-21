using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FreyrFund.Api.Migrations
{
    /// <inheritdoc />
    public partial class BalanceAndIsDeletedAlreadyAdded : Migration
    {        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Colunas Balance e IsDeleted já foram adicionadas manualmente através de script SQL
            // Esta migração serve apenas para manter o registo no histórico
        }        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Esta migração é apenas um marcador - as mudanças não são revertíveis
            // pois foram aplicadas manualmente
        }
    }
}
