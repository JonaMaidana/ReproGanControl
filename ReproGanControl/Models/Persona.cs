using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Persona
{
    [Key]
    public int PersonaID { get; set; }
    public int UsuarioID { get; set;}
     public int LocalidadID { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public int Tel { get; set; }
    public virtual Localidad Localidad { get; set; }
}