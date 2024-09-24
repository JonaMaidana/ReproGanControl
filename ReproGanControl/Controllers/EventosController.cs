using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Reflection;
using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Controllers;
[Authorize]
public class EventosController : Controller
{
    private ApplicationDbContext _context;

    //CONSTRUCTOR
    public EventosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Crear una lista de SelectListItem que incluya el elemento adicional
        var estadoSelectListItems = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE]" }
        };

        // Obtener todas las opciones del enum
        var enumValues = Enum.GetValues(typeof(EventoEnum)).Cast<EventoEnum>();

        // Convertir las opciones del enum en SelectListItem
        estadoSelectListItems.AddRange(enumValues.Select(e => new SelectListItem
        {
            Value = ((int)e).ToString(), // Usa la conversión a entero si trabajas con valores numéricos
            Text = e.ToString().ToUpper()
        }));

        // Configurar ViewBag para los estados
        ViewBag.TipoEventoID = new SelectList(estadoSelectListItems, "Value", "Text");

        var tipoCriaSelectListItems = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE]" }
        };

        var tipoCriaEnumValues = Enum.GetValues(typeof(EnumTipoCria)).Cast<EnumTipoCria>();
        tipoCriaSelectListItems.AddRange(tipoCriaEnumValues.Select(e => new SelectListItem
        {
            Value = ((int)e).ToString(),
            Text = e.ToString().ToUpper()
        }));

        ViewBag.TipoCriaID = new SelectList(tipoCriaSelectListItems, "Value", "Text");

        var estadoCriaSelectListItems = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE]" }
        };

        var estadoCriaEnumValues = Enum.GetValues(typeof(EnumEstadoCria)).Cast<EnumEstadoCria>();
        estadoCriaSelectListItems.AddRange(estadoCriaEnumValues.Select(e => new SelectListItem
        {
            Value = ((int)e).ToString(),
            Text = e.ToString().ToUpper()
        }));

        ViewBag.EstadoCriaID = new SelectList(estadoCriaSelectListItems, "Value", "Text");

        var tipoInseminacionSelectListItems = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE]" }
        };

        var tipoInseminacionEnumValues = Enum.GetValues(typeof(EnumTipoInseminacion)).Cast<EnumTipoInseminacion>();
        tipoInseminacionSelectListItems.AddRange(tipoInseminacionEnumValues.Select(e => new SelectListItem
        {
            Value = ((int)e).ToString(),
            Text = e.ToString().ToUpper()
        }));

        ViewBag.TipoInseminacionID = new SelectList(tipoInseminacionSelectListItems, "Value", "Text");

        // Obtener todos los animales y configurar el dropdown para el AnimalID
        var animales = _context.Animales.ToList();
        animales.Add(new Animal { AnimalID = 0, Caravana = "[SELECCIONE]" });
        ViewBag.AnimalID = new SelectList(animales.OrderBy(d => d.Caravana), "AnimalID", "Caravana");

        var tipoAnimalToro = _context.TipoAnimales.FirstOrDefault(t => t.Descripcion == "TORO");
        if (tipoAnimalToro != null)
        {
            var toros = _context.Animales
                .Where(a => a.TipoAnimalID == tipoAnimalToro.TipoAnimalID) // Suponiendo que `TipoAnimalID` está en el modelo de `Animal`
                .ToList();

            // Agregar un elemento "[SELECCIONE]" al inicio
            toros.Insert(0, new Animal { AnimalID = 0, Caravana = "[SELECCIONE]" });

            // Llenar el ViewBag con los toros
            ViewBag.ToroID = new SelectList(toros.OrderBy(d => d.Caravana), "AnimalID", "Caravana");
        }
        return View();
    }

    public JsonResult ListadoEventos(int? id, int? BuscarTipoEventoID, DateTime? FechaDesde, DateTime? FechaHasta)
    {
        var eventos = _context.Eventos.Include(a => a.Animal).ToList();

        if (id != null)
        {
            eventos = eventos.Where(e => e.EventoID == id).ToList();
        }

        if (BuscarTipoEventoID != null && BuscarTipoEventoID != 0)
        {
            eventos = eventos.Where(e => e.TipoEvento == (EventoEnum)BuscarTipoEventoID).ToList();
        }

        if (FechaDesde.HasValue && FechaHasta.HasValue)
        {
            eventos = eventos.Where(t => t.FechaEvento >= FechaDesde.Value && t.FechaEvento <= FechaHasta.Value).ToList();
        }
        else if (FechaDesde.HasValue)
        {
            eventos = eventos.Where(t => t.FechaEvento >= FechaDesde.Value).ToList();
        }
        else if (FechaHasta.HasValue)
        {
            eventos = eventos.Where(t => t.FechaEvento <= FechaHasta.Value).ToList();
        }

        var eventosMostrar = eventos
            .Select(e => new VistaEventos
            {
                EventoID = e.EventoID,
                AnimalID = e.AnimalID,
                AnimalCaravana = e.Animal.Caravana,
                TipoEvento = e.TipoEvento,
                TipoEventoString = e.TipoEvento.ToString().ToUpper(),
                FechaEvento = e.FechaEvento,
                FechaEventoString = e.FechaEvento.ToString("dd/MM/yyyy"),
                Observacion = string.IsNullOrEmpty(e.Observacion) ? "NINGUNA" : e.Observacion,

                TipoParto = e.TipoParto,
                TipoCria = e.TipoCria,
                TipoCriaString = e.TipoCria?.ToString().ToUpper(),
                EstadoCria = e.EstadoCria,
                EstadoCriaString = e.EstadoCria?.ToString().ToUpper(),
                FechaAproximadaSecado = e.FechaAproximadaSecado,
                FechaAproximadaSecadoString = e.FechaAproximadaSecado?.ToString("dd/MM/yyyy"),
                FechaAproximadaParicion = e.FechaAproximadaParicion,
                FechaAproximadaParicionString = e.FechaAproximadaParicion?.ToString("dd/MM/yyyy"),
                CausaAborto = e.CausaAborto,
                TipoInseminacion = e.TipoInseminacion,
                TipoInseminacionString = e.TipoInseminacion?.ToString().ToUpper(),
                ToroID = e.ToroID,
                DetalleToro = e.DetalleToro,
                MotivoVenta = e.MotivoVenta,
                CausaRechazo = e.CausaRechazo,
                MotivoMuerte = e.MotivoMuerte,
                EspecifiqueOtro = e.EspecifiqueOtro,

            })
            .OrderByDescending(e => e.EventoID)
            .ToList();

        return Json(eventosMostrar);
    }


    public JsonResult GuardarEventos(int eventoID, int animalID, EventoEnum tipoEvento, DateTime fechaEvento, string observacion, EnumTipoCria? tipoCria,
    string tipoParto, EnumEstadoCria? estadoCria, DateTime? fechaAproximadaSecado, DateTime? fechaAproximadaParicion, string causaAborto, EnumTipoInseminacion? tipoInseminacion, int? toroID, string? detalleToro,
    string? motivoVenta, string? motivoMuerte, string causaRechazo, string especifiqueOtro)
    {
        // Validar si el AnimalID ya está registrado en otro evento
        bool animalIDExistente = _context.Eventos.Any(e => e.AnimalID == animalID && e.EventoID != eventoID);

        if (animalIDExistente)
        {
            return Json(new { success = false, message = "Este Animal ya tiene un evento." });
        }

        observacion = observacion.ToUpper();


        if (eventoID == 0)
        {
            // Crear nuevo evento
            var evento = new Evento
            {
                AnimalID = animalID,
                TipoEvento = tipoEvento,
                FechaEvento = fechaEvento,
                Observacion = observacion,
                TipoCria = tipoCria,
                TipoParto = tipoParto,
                EstadoCria = estadoCria,
                FechaAproximadaSecado = fechaAproximadaSecado,
                FechaAproximadaParicion = fechaAproximadaParicion,
                CausaAborto = causaAborto,
                TipoInseminacion = tipoInseminacion,
                ToroID = toroID,
                DetalleToro = detalleToro,
                MotivoVenta = motivoVenta,
                MotivoMuerte = motivoMuerte,
                CausaRechazo = causaRechazo,
                EspecifiqueOtro = especifiqueOtro
            };
            _context.Add(evento);
            _context.SaveChanges();
        }
        else
        {
            // Editar evento existente
            var eventoExistente = _context.Eventos.SingleOrDefault(e => e.EventoID == eventoID);
            if (eventoExistente != null)
            {
                eventoExistente.AnimalID = animalID;
                eventoExistente.TipoEvento = tipoEvento;
                eventoExistente.FechaEvento = fechaEvento;
                eventoExistente.Observacion = observacion;
                eventoExistente.TipoCria = tipoCria;
                eventoExistente.TipoParto = tipoParto;
                eventoExistente.EstadoCria = estadoCria;
                eventoExistente.FechaAproximadaSecado = fechaAproximadaSecado;
                eventoExistente.FechaAproximadaParicion = fechaAproximadaParicion;
                eventoExistente.CausaAborto = causaAborto;
                eventoExistente.TipoInseminacion = tipoInseminacion;
                eventoExistente.ToroID = toroID;
                eventoExistente.DetalleToro = detalleToro;
                eventoExistente.MotivoVenta = motivoVenta;
                eventoExistente.MotivoMuerte = motivoMuerte;
                eventoExistente.CausaRechazo = causaRechazo;
                eventoExistente.EspecifiqueOtro = especifiqueOtro;

                _context.Update(eventoExistente);
                _context.SaveChanges();
            }
        }
        return Json(new { success = true });
    }

    public JsonResult EliminarEvento(int eventoID)
    {
        var evento = _context.Eventos.Find(eventoID);
        _context.Remove(evento);
        _context.SaveChanges();

        return Json(true);
    }

    public JsonResult ObtenerEstadoAnimal()
    {

        return Json(true);
    }
}
//     public ActionResult InformesEventos()
//     {
//         var tipoEventos = Enum.GetValues(typeof(EventoEnum)).Cast<EventoEnum>();

//         var estadoSelectListItems = tipoEventos.Select(e => new SelectListItem
//         {
//             Value = ((int)e).ToString(),
//             Text = e.ToString().ToUpper()
//         }).ToList();

//         estadoSelectListItems.Insert(0, new SelectListItem
//         {
//             Value = "",
//             Text = "[SELECCIONE]"
//         });

//         ViewBag.TipoEventoBuscarID = new SelectList(estadoSelectListItems, "Value", "Text");

//         return View();
//     }

//     public JsonResult ListadoInformeEventos(int? TipoEventoBuscarID)
//     {

//         List<VistaInformeEventos> vistaInformeEventos = new List<VistaInformeEventos>();


//         var eventos = _context.Eventos.Include(t => t.Animal).ToList();

//         if (TipoEventoBuscarID != null && TipoEventoBuscarID != 0)
//         {
//             eventos = eventos.Where(e => e.TipoEvento == (EventoEnum)TipoEventoBuscarID).ToList();
//         }

//         // Filtro para ordenar
//         eventos = eventos.OrderBy(e => e.TipoEvento).ToList();

//         foreach (var listadoEventos in eventos)
//         {

//             var tipoEventosMostrar = vistaInformeEventos.Where(t => t.TipoEvento == listadoEventos.TipoEvento).SingleOrDefault();
//             if (tipoEventosMostrar == null)
//             {
//                 tipoEventosMostrar = new VistaInformeEventos
//                 {
//                     TipoEvento = listadoEventos.TipoEvento,
//                     TipoEventoString = listadoEventos.TipoEvento.ToString(),
//                     vistaEventos = new List<VistaEventos>()
//                 };
//                 vistaInformeEventos.Add(tipoEventosMostrar);
//             }

//             var eventosMostrar = new VistaEventos
//             {
//                 AnimalCaravana = listadoEventos.Animal.Caravana,
//                 FechaEventoString = listadoEventos.FechaEvento.ToString("dd/MM/yyyy"),
//                 Observacion = string.IsNullOrEmpty(listadoEventos.Observacion) ? "NINGUNA" : listadoEventos.Observacion,
//                 TipoCriaString = listadoEventos.TipoCria.HasValue ? (listadoEventos.TipoCria.Value ? "Macho" : "Hembra") : "",
//                 TipoParto = listadoEventos.TipoParto,
//                 EstadoCriaString = listadoEventos.EstadoCria.HasValue ? (listadoEventos.EstadoCria.Value ? "Vivo" : "Muerto") : "",
//                 CausaAborto = listadoEventos.CausaAborto,
//                 InseminacionString = listadoEventos.Inseminacion.HasValue ? (listadoEventos.Inseminacion.Value ? "Monta" : "Inseminación Artificial") : "",
//                 CausaCelo = listadoEventos.CausaCelo,
//                 EspecifiqueSecado = listadoEventos.EspecifiqueSecado,
//                 MotivoVenta = listadoEventos.MotivoVenta,
//                 CausaRechazo = listadoEventos.CausaRechazo,
//                 EspecifiqueOtro = listadoEventos.EspecifiqueOtro,
//             };
//             tipoEventosMostrar.vistaEventos.Add(eventosMostrar);
//         }

//         return Json(vistaInformeEventos);
//     }
// }
