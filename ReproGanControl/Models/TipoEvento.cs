using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class TipoEvento
{
    [Key]
    public int TipoEventoID { get; set;}
    public string? Descripcion { get; set;}
    public virtual ICollection<Evento> Eventos { get; set;}
}