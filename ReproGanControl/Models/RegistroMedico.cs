using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class RegistroMedico
{
    [Key]
    public int RegistroMedicoID { get; set; }
    public int AnimalID { get; set; }
    public int PersonaID { get; set; }
    public DateTime Fecha { get; set; }
    public string? Tratamiento { get; set; }
    public string? Enfermedad { get; set; }
    public string? Observacion { get; set; }

    public virtual Animal Animal { get; set; }
    public virtual Persona Persona { get; set; }
}

public class VistaRegistroMedico
{
    public int RegistroMedicoID { get; set; }
    public int PersonaID { get; set; }
    public int AnimalID { get; set; }
    public DateTime Fecha { get; set; }
    public string? Tratamiento { get; set; }
    public string? Enfermedad { get; set; }
    public string? FechaString { get; set; }
    public string? Observacion { get; set; }
    public string? AnimalCaravana { get; set; }
    public string? NombrePersona { get; set; }

}