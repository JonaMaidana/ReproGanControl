using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReproGanControl.Migrations
{
    /// <inheritdoc />
    public partial class SuperUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Establecimientos_LocalidadID",
                table: "Establecimientos",
                column: "LocalidadID");

            migrationBuilder.CreateIndex(
                name: "IX_Animales_EstablecimientoID",
                table: "Animales",
                column: "EstablecimientoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Establecimientos_EstablecimientoID",
                table: "Animales",
                column: "EstablecimientoID",
                principalTable: "Establecimientos",
                principalColumn: "EstablecimientoID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Establecimientos_Localidades_LocalidadID",
                table: "Establecimientos",
                column: "LocalidadID",
                principalTable: "Localidades",
                principalColumn: "LocalidadID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Establecimientos_EstablecimientoID",
                table: "Animales");

            migrationBuilder.DropForeignKey(
                name: "FK_Establecimientos_Localidades_LocalidadID",
                table: "Establecimientos");

            migrationBuilder.DropIndex(
                name: "IX_Establecimientos_LocalidadID",
                table: "Establecimientos");

            migrationBuilder.DropIndex(
                name: "IX_Animales_EstablecimientoID",
                table: "Animales");
        }
    }
}
