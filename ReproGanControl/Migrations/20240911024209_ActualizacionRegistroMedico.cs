using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReproGanControl.Migrations
{
    /// <inheritdoc />
    public partial class ActualizacionRegistroMedico : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PersonaID",
                table: "RegistroMedicos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_RegistroMedicos_PersonaID",
                table: "RegistroMedicos",
                column: "PersonaID");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistroMedicos_Personas_PersonaID",
                table: "RegistroMedicos",
                column: "PersonaID",
                principalTable: "Personas",
                principalColumn: "PersonaID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistroMedicos_Personas_PersonaID",
                table: "RegistroMedicos");

            migrationBuilder.DropIndex(
                name: "IX_RegistroMedicos_PersonaID",
                table: "RegistroMedicos");

            migrationBuilder.DropColumn(
                name: "PersonaID",
                table: "RegistroMedicos");
        }
    }
}
