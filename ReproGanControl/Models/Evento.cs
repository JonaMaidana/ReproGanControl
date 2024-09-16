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

    public bool? TipoCria { get; set; }
    public string? TipoParto { get; set; }
    public bool? EstadoCria { get; set; }
    public string? CausaAborto { get; set; }
    public bool? Inseminacion { get; set; }
    public string? CausaCelo { get; set; }
    public string? EspecifiqueSecado { get; set; }
    public string? MotivoVenta { get; set; }
    public string? CausaRechazo { get; set; }
    public string? EspecifiqueOtro { get; set; }

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
    Otro
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

    public bool? TipoCria { get; set; }
    public string? TipoCriaString { get; set; }
    public string? TipoParto { get; set; }
    public bool? EstadoCria { get; set; }
    public string? EstadoCriaString { get; set; }
    public string? CausaAborto { get; set; }
    public bool? Inseminacion { get; set; }
    public string? InseminacionString { get; set; }
    public string? CausaCelo { get; set; }
    public string? EspecifiqueSecado { get; set; }
    public string? MotivoVenta { get; set; }
    public string? CausaRechazo { get; set; }
    public string? EspecifiqueOtro { get; set; }
}