using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class VistaInformeVacasSecar
{
    public string? AnimalCaravana { get; set; }
    public string? FechaAproximadaSecadoString { get; set; }
    public int DiasRestantesSecado { get; set; }
}