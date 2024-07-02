using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Provincia
{
    [Key]
    public int ProvinciaID { get; set;}
    public string? Nombre { get; set;}
    public string? CodigoPostal { get; set;}

    public virtual ICollection<Localidad> Localidades { get; set;}
}