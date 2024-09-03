using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class Evento
{
    [Key]
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public EstadoEnum Estado { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? Observacion { get; set; }


    public virtual Animal Animal { get; set; }
}

public enum EstadoEnum
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
    public EstadoEnum Estado { get; set; }
    public string? EstadoString { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? FechaEventoString { get; set; }
    public string? Observacion { get; set; }
}