using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReproGanControl.Migrations
{
    /// <inheritdoc />
    public partial class ModeloEstablecimiento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Establecimiento",
                table: "Animales");

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoID",
                table: "Animales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Establecimientos",
                columns: table => new
                {
                    EstablecimientoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LocalidadID = table.Column<int>(type: "int", nullable: false),
                    NombreEstablecimiento = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Establecimientos", x => x.EstablecimientoID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Establecimientos");

            migrationBuilder.DropColumn(
                name: "EstablecimientoID",
                table: "Animales");

            migrationBuilder.AddColumn<string>(
                name: "Establecimiento",
                table: "Animales",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
