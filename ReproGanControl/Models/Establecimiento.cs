using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Establecimiento
{
    [Key]
    public int EstablecimientoID { get; set; }
    public int LocalidadID { get; set; }
    public string? NombreEstablecimiento { get; set; }

    public virtual ICollection<Animal> Animales { get; set; }
    public virtual Localidad Localidad { get; set; }
}

public class VistaEstablecimientos
{
    public int EstablecimientoID { get; set; }
    public int LocalidadID { get; set; }
    public int ProvinciaID { get; set; }
    public string? NombreProvincia { get; set; }
    public string? NombreLocalidad { get; set; }
    public string? NombreEstablecimiento { get; set; }

}