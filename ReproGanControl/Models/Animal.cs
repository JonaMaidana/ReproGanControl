using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Animal
{
    [Key]
    public int AnimalID { get; set; }
    public int EstadoID { get; set; }
    public int TipoAnimalID { get; set; }
    public string? Caravana { get; set; }
    
    public virtual ICollection<Evento> Eventos { get; set;}
    public virtual ICollection<RegistroMedico> RegistroMedicos { get; set;}
    public virtual TipoAnimal TipoAnimal { get; set; }
    public virtual Estado Estado { get; set; }
}