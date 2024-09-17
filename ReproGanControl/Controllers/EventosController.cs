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
            new SelectListItem { Value = "0", Text = "[SELECCIONE...]" }
        };

        // Obtener todas las opciones del enum
        var enumValues = Enum.GetValues(typeof(EventoEnum)).Cast<EventoEnum>();

        // Convertir las opciones del enum en SelectListItem
        // Convertir las opciones del enum en SelectListItem
        estadoSelectListItems.AddRange(enumValues.Select(e => new SelectListItem
        {
            Value = ((int)e).ToString(), // Usa la conversión a entero si trabajas con valores numéricos
            Text = e.ToString().ToUpper()
        }));

        // Configurar ViewBag para los estados
        ViewBag.TipoEventoID = new SelectList(estadoSelectListItems, "Value", "Text");

        // Obtener todos los animales y configurar el dropdown para el AnimalID
        var animales = _context.Animales.ToList();
        animales.Add(new Animal { AnimalID = 0, Caravana = "[SELECCIONE]" });
        ViewBag.AnimalID = new SelectList(animales.OrderBy(d => d.Caravana), "AnimalID", "Caravana");

        return View();
    }

    public JsonResult ListadoEventos(int? id)
    {
        var eventos = _context.Eventos.Include(a => a.Animal).ToList();
        if (id != null)
        {
            eventos = eventos.Where(e => e.EventoID == id).ToList();
        }

        var eventosMostrar = eventos
            .Select(e => new VistaEventos
            {
                EventoID = e.EventoID,
                AnimalID = e.AnimalID,
                AnimalCaravana = e.Animal.Caravana,
                EstadoAnimal = e.Animal.Estado.ToString().ToUpper(),
                TipoEvento = e.TipoEvento,
                TipoEventoString = e.TipoEvento.ToString().ToUpper(),
                FechaEvento = e.FechaEvento,
                FechaEventoString = e.FechaEvento.ToString("dd/MM/yyyy"),
                Observacion = string.IsNullOrEmpty(e.Observacion) ? "NINGUNA" : e.Observacion,
                TipoCria = e.TipoCria,
                TipoCriaString = e.TipoCria.HasValue ? (e.TipoCria.Value ? "Macho" : "Hembra") : "",
                TipoParto = e.TipoParto,
                EstadoCria = e.EstadoCria,
                EstadoCriaString = e.EstadoCria.HasValue ? (e.EstadoCria.Value ? "Vivo" : "Muerto") : "",
                CausaAborto = e.CausaAborto,
                Inseminacion = e.Inseminacion,
                InseminacionString = e.Inseminacion.HasValue ? (e.Inseminacion.Value ? "Monta" : "Inseminación Artificial") : "",
                CausaCelo = e.CausaCelo,
                EspecifiqueSecado = e.EspecifiqueSecado,
                MotivoVenta = e.MotivoVenta,
                CausaRechazo = e.CausaRechazo,
                EspecifiqueOtro = e.EspecifiqueOtro
            })
            .ToList();

        return Json(eventosMostrar);
    }

    public JsonResult GuardarEventos(int eventoID, int animalID, EventoEnum tipoEvento, DateTime fechaEvento, string observacion, bool? tipoCria,
    string tipoParto, bool? estadoCria, string causaAborto, bool? inseminacion, string causaCelo, string especifiqueSecado,
    string motivoVenta, string causaRechazo, string especifiqueOtro)
    {
        // Validar si el tipoEvento es válido
        if (!Enum.IsDefined(typeof(EventoEnum), tipoEvento))
        {
            return Json(new { success = false, message = "El tipo evento es obligatorio." });
        }

        // Validar si el AnimalID ya está registrado en otro evento
        bool animalIDExistente = _context.Eventos.Any(e => e.AnimalID == animalID && e.EventoID != eventoID);

        if (animalIDExistente)
        {
            return Json(new { success = false, message = "Este Animal ya tiene un evento." });
        }

        if (eventoID == 0)
        {
            // Crear nuevo evento
            var evento = new Evento
            {
                AnimalID = animalID,
                TipoEvento = tipoEvento,
                FechaEvento = fechaEvento,
                Observacion = observacion,

                TipoCria = tipoEvento == EventoEnum.Parto ? tipoCria : null,
                TipoParto = tipoEvento == EventoEnum.Parto ? tipoParto : null,
                EstadoCria = tipoEvento == EventoEnum.Parto ? estadoCria : null,
                CausaAborto = tipoEvento == EventoEnum.Aborto ? causaAborto : null,
                Inseminacion = tipoEvento == EventoEnum.Servicio ? inseminacion : null,
                CausaCelo = tipoEvento == EventoEnum.Celo ? causaCelo : null,
                EspecifiqueSecado = tipoEvento == EventoEnum.Secado ? especifiqueSecado : null,
                MotivoVenta = tipoEvento == EventoEnum.Venta ? motivoVenta : null,
                CausaRechazo = tipoEvento == EventoEnum.Rechazo ? causaRechazo : null,
                EspecifiqueOtro = tipoEvento == EventoEnum.Otro ? especifiqueOtro : null
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

                // Actualizar los campos específicos según el tipo de evento
                eventoExistente.TipoCria = tipoEvento == EventoEnum.Parto ? tipoCria : null;
                eventoExistente.TipoParto = tipoEvento == EventoEnum.Parto ? tipoParto : null;
                eventoExistente.EstadoCria = tipoEvento == EventoEnum.Parto ? estadoCria : null;
                eventoExistente.CausaAborto = tipoEvento == EventoEnum.Aborto ? causaAborto : null;
                eventoExistente.Inseminacion = tipoEvento == EventoEnum.Servicio ? inseminacion : null;
                eventoExistente.CausaCelo = tipoEvento == EventoEnum.Celo ? causaCelo : null;
                eventoExistente.EspecifiqueSecado = tipoEvento == EventoEnum.Secado ? especifiqueSecado : null;
                eventoExistente.MotivoVenta = tipoEvento == EventoEnum.Venta ? motivoVenta : null;
                eventoExistente.CausaRechazo = tipoEvento == EventoEnum.Rechazo ? causaRechazo : null;
                eventoExistente.EspecifiqueOtro = tipoEvento == EventoEnum.Otro ? especifiqueOtro : null;

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

    public JsonResult ObtenerEstadoAnimal(int id)
    {
        var animal = _context.Animales.SingleOrDefault(a => a.AnimalID == id);
        if (animal != null)
        {
            return Json(new { estadoAnimal = animal.Estado.ToString().ToUpper() });
        }
        return Json(new { estadoAnimal = "" });
    }

    public ActionResult InformesEventos()
    {

        return View();
    }

    public JsonResult ListadoInformeEventos(DateTime? buscarActividadInicio, DateTime? buscarActividadFin, int? TipoEjerciciosBuscarID)
    {

        List<VistaInformeEventos> vistaInformeEventos = new List<VistaInformeEventos>();


        var eventos = _context.Eventos.Include(t => t.Animal).ToList();

        // filtro para buscar
        // if (buscarActividadInicio != null && buscarActividadFin != null)
        // {
        //     ejerciciosFisicos = ejerciciosFisicos.Where(e => e.Inicio >= buscarActividadInicio && e.Inicio <= buscarActividadFin).ToList();
        // }

        // Filtro para buscar por nombre del ejercicio
        // if (TipoEjerciciosBuscarID != null && TipoEjerciciosBuscarID != 0)
        // {
        //     ejerciciosFisicos = ejerciciosFisicos.Where(e => e.TipoEjercicioID == TipoEjerciciosBuscarID).ToList();
        // }

        // Filtro para ordenar
        // eventos = eventos.OrderBy(e => e.).ToList();



        foreach (var listadoEventos in eventos)
        {

            var tipoEventosMostrar = vistaInformeEventos.Where(t => t.TipoEvento == listadoEventos.TipoEvento).SingleOrDefault();
            if (tipoEventosMostrar == null)
            {
                tipoEventosMostrar = new VistaInformeEventos
                {
                    TipoEvento = listadoEventos.TipoEvento,
                    TipoEventoString = listadoEventos.TipoEvento.ToString(),
                    vistaEventos = new List<VistaEventos>()
                };
                vistaInformeEventos.Add(tipoEventosMostrar);
            }

            var eventosMostrar = new VistaEventos
            {
                AnimalCaravana = listadoEventos.Animal.Caravana,
                EstadoAnimal = listadoEventos.Animal.Estado.ToString(),
                FechaEventoString = listadoEventos.FechaEvento.ToString("dd/MM/yyyy"),
                Observacion = string.IsNullOrEmpty(listadoEventos.Observacion) ? "NINGUNA" : listadoEventos.Observacion,
                TipoCriaString = listadoEventos.TipoCria.HasValue ? (listadoEventos.TipoCria.Value ? "Macho" : "Hembra") : "",
                TipoParto = listadoEventos.TipoParto,
                EstadoCriaString = listadoEventos.EstadoCria.HasValue ? (listadoEventos.EstadoCria.Value ? "Vivo" : "Muerto") : "",
                CausaAborto = listadoEventos.CausaAborto,
                InseminacionString = listadoEventos.Inseminacion.HasValue ? (listadoEventos.Inseminacion.Value ? "Monta" : "Inseminación Artificial") : "",
                CausaCelo = listadoEventos.CausaCelo,   
                EspecifiqueSecado = listadoEventos.EspecifiqueSecado,
                MotivoVenta = listadoEventos.MotivoVenta,
                CausaRechazo = listadoEventos.CausaRechazo,
                EspecifiqueOtro = listadoEventos.EspecifiqueOtro,
            };
            tipoEventosMostrar.vistaEventos.Add(eventosMostrar);
        }

        return Json(vistaInformeEventos);
    }
}
