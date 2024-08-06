using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Evento
{
    [Key]
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public int EstadoID { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? Observacion { get; set; }
 
    public virtual Animal Animal { get; set; }
    public virtual Estado Estado { get; set; }
}

public class VistaEventos{
    
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public string? AnimalCaravana { get; set; }
    public int EstadoID { get; set; }
    public string? EstadoDescripcion { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? FechaEventoString { get; set; }
    public string? Observacion { get; set; }

}