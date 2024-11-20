using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class VistaInformeVacasParir
{
    public string? Caravana { get; set; }
    public string? FechaAproxParir { get; set; }
    public int DiasRestantesParicion { get; set; }

}