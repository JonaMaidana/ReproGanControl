using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Persona
{
    [Key]
    public int PersonaID { get; set; }
    public int? UsuarioID { get; set; }
    public int LocalidadID { get; set; }
    public string? NombreCompleto { get; set; }
    public string? Email { get; set; }
    public int Tel { get; set; }
    public int NumeroDocumento { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? Domicilio { get; set; }

    public virtual Localidad Localidad { get; set; }
}