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
            })
            .ToList();

        return Json(eventosMostrar);
    }

    public JsonResult GuardarEventos(int eventoID, int animalID, EventoEnum tipoEvento, DateTime fechaEvento, string observacion)
    {
        // Validar si el estado es válido
        if (tipoEvento == null || !Enum.IsDefined(typeof(EventoEnum), tipoEvento))
        {
            return Json(new { success = false, message = "El tipo evento es obligatorio." });
        }

        observacion = string.IsNullOrEmpty(observacion) ? "NINGUNA" : observacion;
        observacion = observacion.ToUpper();
        // Validar si el AnimalID ya está registrado en otro evento
        bool animalIDExistente = _context.Eventos.Any(e => e.AnimalID == animalID && e.EventoID != eventoID);

        if (animalIDExistente)
        {
            return Json(new { success = false, message = "Este Animal ya tiene un evento." });
        }

        if (eventoID == 0)
        {
            var evento = new Evento
            {
                AnimalID = animalID,
                TipoEvento = tipoEvento,
                FechaEvento = fechaEvento,
                Observacion = observacion
            };
            _context.Add(evento);
            _context.SaveChanges();
        }
        else
        {
            var eventoEditar = _context.Eventos.Where(e => e.EventoID == eventoID).SingleOrDefault();
            if (eventoEditar != null)
            {
                eventoEditar.AnimalID = animalID;
                eventoEditar.TipoEvento = tipoEvento;
                eventoEditar.FechaEvento = fechaEvento;
                eventoEditar.Observacion = observacion;

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
        return Json(new { estadoAnimal = "No encontrado" });
    }
}