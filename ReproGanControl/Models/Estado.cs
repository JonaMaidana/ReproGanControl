using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Estado
{
    [Key]
    public int EstadoID { get; set; }
    public string? Descripcion { get; set; }
    public virtual ICollection<Evento> Eventos { get; set;}
}