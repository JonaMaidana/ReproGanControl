using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReproGanControl.Migrations
{
    /// <inheritdoc />
    public partial class MigracionActualizacionEvento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Inseminacion",
                table: "Eventos");

            migrationBuilder.RenameColumn(
                name: "EspecifiqueSecado",
                table: "Eventos",
                newName: "MotivoMuerte");

            migrationBuilder.RenameColumn(
                name: "CausaCelo",
                table: "Eventos",
                newName: "DetalleToro");

            migrationBuilder.AlterColumn<int>(
                name: "TipoCria",
                table: "Eventos",
                type: "int",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EstadoCria",
                table: "Eventos",
                type: "int",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaAproximadaParicion",
                table: "Eventos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaAproximadaSecado",
                table: "Eventos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TipoInseminacion",
                table: "Eventos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ToroID",
                table: "Eventos",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaAproximadaParicion",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "FechaAproximadaSecado",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "TipoInseminacion",
                table: "Eventos");

            migrationBuilder.DropColumn(
                name: "ToroID",
                table: "Eventos");

            migrationBuilder.RenameColumn(
                name: "MotivoMuerte",
                table: "Eventos",
                newName: "EspecifiqueSecado");

            migrationBuilder.RenameColumn(
                name: "DetalleToro",
                table: "Eventos",
                newName: "CausaCelo");

            migrationBuilder.AlterColumn<bool>(
                name: "TipoCria",
                table: "Eventos",
                type: "bit",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "EstadoCria",
                table: "Eventos",
                type: "bit",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Inseminacion",
                table: "Eventos",
                type: "bit",
                nullable: true);
        }
    }
}
