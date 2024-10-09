using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Animal
{
    [Key]
    public int AnimalID { get; set; }
    public int EstablecimientoID { get; set; }
    public int TipoAnimalID { get; set; }
    public string? Caravana { get; set; }
    public string? Apodo { get; set; }
    public string? NombrePadre { get; set; }
    public string? NombreMadre { get; set; }
    public DateTime FechaNacimiento { get; set; }
    
    public virtual ICollection<Evento> Eventos { get; set; }
    public virtual ICollection<RegistroMedico> RegistroMedicos { get; set; }
    public virtual TipoAnimal TipoAnimal { get; set; }
    public virtual Establecimiento Establecimiento { get; set; }
}

public class VistaAnimales
{
    public int AnimalID { get; set; }
    public int TipoAnimalID { get; set; }
    public int EstablecimientoID { get; set; }
    public string? TipoAnimalNombre { get; set; }
    public string? NombreEstablecimiento { get; set; }
    public string? Caravana { get; set; }
    public string? Apodo { get; set; }
    public string? NombrePadre { get; set; }
    public string? NombreMadre { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? FechaNacimientoString { get; set; }
}