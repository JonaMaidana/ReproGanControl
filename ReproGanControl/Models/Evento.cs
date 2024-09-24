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

    public string? TipoParto { get; set; }
    public EnumTipoCria? TipoCria { get; set; }
    public EnumEstadoCria? EstadoCria { get; set; }
    public string? CausaAborto { get; set; }
    public EnumTipoInseminacion? TipoInseminacion { get; set; }
    public int? ToroID { get; set; }
    public string? DetalleToro { get; set; }
    public string? MotivoVenta { get; set; }
    public string? CausaRechazo { get; set; }
    public string? EspecifiqueOtro { get; set; }
    public string? MotivoMuerte { get; set; }
    public DateTime? FechaAproximadaSecado { get; set; }
    public DateTime? FechaAproximadaParicion { get; set; }

    public virtual Animal Animal { get; set; }
}

public enum EnumTipoInseminacion
{
    [Display(Name = "Monta Natural")]
    Monta = 1,
    [Display(Name = "Inseminación Artificial")]
    Artificial
}

public enum EnumEstadoCria
{
    [Display(Name = "Vivo")]
    Vivo = 1,
    [Display(Name = "Muerto")]
    Muerto,
    [Display(Name = "Vivo - Muerto")]
    VivoMuerto,
    [Display(Name = "Vivos")]
    Vivos,
    [Display(Name = "Muertos")]
    Muertos
}

public enum EnumTipoCria
{
    [Display(Name = "Macho")]
    Macho = 1,
    [Display(Name = "Hembra")]
    Hembra,
    [Display(Name = "Macho - Hembra")]
    MachoHembra,
    [Display(Name = "Macho - Macho")]
    MachoMacho,
    [Display(Name = "Hembra - Hembra")]
    HembraHembra
}

public enum EventoEnum
{
    Parto = 1,
    Preñez,
    Aborto,
    Servicio,
    Celo,
    Secado,
    Venta,
    Rechazo,
    Muerte,
    Otro
}

public class VistaEventos
{
    public int EventoID { get; set; }
    public int AnimalID { get; set; }
    public string? AnimalCaravana { get; set; }
    public EventoEnum TipoEvento { get; set; }
    public string? TipoEventoString { get; set; }
    public DateTime FechaEvento { get; set; }
    public string? FechaEventoString { get; set; }
    public string? Observacion { get; set; }


    public string? TipoParto { get; set; }
    public EnumTipoCria? TipoCria { get; set; }
    public string? TipoCriaString { get; set; }
    public EnumEstadoCria? EstadoCria { get; set; }
    public string? EstadoCriaString { get; set; }
    public DateTime? FechaAproximadaSecado { get; set; }
    public string? FechaAproximadaSecadoString { get; set; }
    public DateTime? FechaAproximadaParicion { get; set; }
    public string? FechaAproximadaParicionString { get; set; }
    public string? CausaAborto { get; set; }
    public EnumTipoInseminacion? TipoInseminacion { get; set; }
    public string? TipoInseminacionString { get; set; }
    public int? ToroID { get; set; }
     public string? ToroString { get; set; }
    public string? DetalleToro { get; set; }
    public string? MotivoVenta { get; set; }
    public string? CausaRechazo { get; set; }
    public string? MotivoMuerte { get; set; }
    public string? EspecifiqueOtro { get; set; }
}