using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class VistaInformeRegistroMedico
{
    public int PersonaID { get; set; }
    public string? NombrePersona { get; set; }

    public List<VistaRegistroMedico> vistaRegistroMedico { get; set; }

}