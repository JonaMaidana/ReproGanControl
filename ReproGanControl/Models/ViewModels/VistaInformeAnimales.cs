using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Models;

public class VistaInformeAnimales
{
   public int TipoAnimalID { get; set; }
   public string? TipoAnimalNombre { get; set; }

    public List<VistaAnimales> vistaAnimales{ get; set; }

}