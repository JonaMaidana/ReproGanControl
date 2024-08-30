using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReproGanControl.Migrations
{
    /// <inheritdoc />
    public partial class ModeloActualizacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tel",
                table: "RegistroMedicos");

            migrationBuilder.RenameColumn(
                name: "NombreVeterinario",
                table: "RegistroMedicos",
                newName: "Observacion");

            migrationBuilder.RenameColumn(
                name: "ApellidoVeterinario",
                table: "RegistroMedicos",
                newName: "Enfermedad");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Observacion",
                table: "RegistroMedicos",
                newName: "NombreVeterinario");

            migrationBuilder.RenameColumn(
                name: "Enfermedad",
                table: "RegistroMedicos",
                newName: "ApellidoVeterinario");

            migrationBuilder.AddColumn<int>(
                name: "Tel",
                table: "RegistroMedicos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
