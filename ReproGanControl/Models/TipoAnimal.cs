using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class TipoAnimal
{
    [Key]
    public int TipoAnimalID { get; set;}
    public string? Descripcion { get; set;}
    public virtual ICollection<Animal> Animales { get; set;}
}