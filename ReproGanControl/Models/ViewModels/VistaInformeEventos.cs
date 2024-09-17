using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class VistaInformeEventos
{
    public EventoEnum TipoEvento { get; set; }
    public string? TipoEventoString { get; set; }

    public List<VistaEventos> vistaEventos { get; set; }

}