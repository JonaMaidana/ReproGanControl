using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Localidad
{
    [Key]
    public int LocalidadID { get; set; }
    public int ProvinciaID { get; set;}
    public string? Nombre { get; set; }
    public string? CodigoPostal { get; set; }
    public virtual ICollection<Persona> Personas { get; set;}
    public virtual Provincia Provincia { get; set; }
}