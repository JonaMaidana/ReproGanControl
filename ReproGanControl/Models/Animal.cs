using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Animal
{
    [Key]
    public int AnimalID { get; set; }
    public int TipoAnimalID { get; set; }
    public string? Caravana { get; set; }
    public string? Apodo { get; set; }
    public string? NombrePadre { get; set; }
    public string? NombreMadre { get; set; }
    public string? Establecimiento { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public Estado Estado { get; set; }

    public virtual ICollection<Evento> Eventos { get; set; }
    public virtual ICollection<RegistroMedico> RegistroMedicos { get; set; }
    public virtual TipoAnimal TipoAnimal { get; set; }
}

public class VistaAnimales
{

    public int AnimalID { get; set; }
    public int TipoAnimalID { get; set; }
    public string? TipoAnimalNombre { get; set; }
    public string? Caravana { get; set; }
    public string? Apodo { get; set; }
    public string? NombrePadre { get; set; }
    public string? NombreMadre { get; set; }
    public string? Establecimiento { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? FechaNacimientoString { get; set; }
    public Estado Estado { get; set; }
    public string? EstadoString { get; set; }
}

public enum Estado
{
    Preñada = 1,
    PreñadaDudosa,
    Vacia,
    VaciaDudosa,
}