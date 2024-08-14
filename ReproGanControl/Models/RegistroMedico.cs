using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class RegistroMedico
{
    [Key]
    public int RegistroMedicoID { get; set;}
    public int AnimalID { get; set;}
    public DateTime Fecha { get; set;}
    public string? Tratamiento { get; set;}
    public string? NombreVeterinario { get; set;}
    public string? ApellidoVeterinario { get; set;}
    public int Tel { get; set;}
    public virtual Animal Animal { get; set; }

}