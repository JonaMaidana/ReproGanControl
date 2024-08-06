using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReproGanControl.Migrations
{
    /// <inheritdoc />
    public partial class TodosLosModelos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animales_Estados_EstadoID",
                table: "Animales");

            migrationBuilder.DropIndex(
                name: "IX_Animales_EstadoID",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "EstadoID",
                table: "Animales");

            migrationBuilder.AddColumn<int>(
                name: "EstadoID",
                table: "Eventos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Apodo",
                table: "Animales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Establecimiento",
                table: "Animales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaNacimiento",
                table: "Animales",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "NombreMadre",
                table: "Animales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NombrePadre",
                table: "Animales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Eventos_EstadoID",
                table: "Eventos",
                column: "EstadoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Eventos_Estados_EstadoID",
                table: "Eventos",
                column: "EstadoID",
                principalTable: "Estados",
                principalColumn: "EstadoID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Eventos_Estados_EstadoID",
                table: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_Eventos_EstadoID",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "EstadoID",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "Apodo",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "Establecimiento",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "FechaNacimiento",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "NombreMadre",
                table: "Animales");

            migrationBuilder.DropColumn(
                name: "NombrePadre",
                table: "Animales");

            migrationBuilder.AddColumn<int>(
                name: "EstadoID",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Animales_EstadoID",
                table: "Animales",
                column: "EstadoID");

            migrationBuilder.AddForeignKey(
                name: "FK_Animales_Estados_EstadoID",
                table: "Animales",
                column: "EstadoID",
                principalTable: "Estados",
                principalColumn: "EstadoID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
