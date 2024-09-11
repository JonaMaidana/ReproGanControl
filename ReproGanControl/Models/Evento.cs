using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Evento
{
    [Key]
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public EventoEnum TipoEvento { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? Observacion { get; set; }

    public virtual Animal Animal { get; set; }
}

public enum EventoEnum
{
    Parto = 1,
    Aborto,
    Servicio,
    Celo,
    Secado,
    Venta,
    Rechazo,
    Muerte,
    Otros
}
public class VistaEventos
{
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public string? AnimalCaravana { get; set; }
    public string? EstadoAnimal { get; set; }
    public EventoEnum TipoEvento { get; set; }
    public string? TipoEventoString { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? FechaEventoString { get; set; }
    public string? Observacion { get; set; }
}