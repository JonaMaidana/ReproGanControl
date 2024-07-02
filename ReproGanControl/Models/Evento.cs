using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Evento
{
    [Key]
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public int TipoEventoID { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? FechaAproximada { get; set; }
    public string? TipoCria { get; set; }

    public virtual TipoEvento TipoEvento { get; set; }
    public virtual Animal Animal { get; set; }
}