using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        var animales = _context.Animales.ToList();
        animales.Add(new Animal { AnimalID = 0, Caravana = "[SELECCIONE]" });
        ViewBag.AnimalID = new SelectList(animales.OrderBy(d => d.Caravana), "AnimalID", "Caravana");

        var estados = _context.Estados.ToList();
        estados.Add(new Estado { EstadoID = 0, Descripcion = "[SELECCIONE]" });
        ViewBag.EstadoID = new SelectList(estados.OrderBy(d => d.Descripcion), "EstadoID", "Descripcion");
        return View();
    }

    public JsonResult ListadoEventos(int? id)
    {
        var eventos = _context.Eventos.Include(a => a.Animal).Include(e => e.Estado).ToList();
        if (id != null)
        {
            eventos = eventos.Where(e => e.EventoID == id).ToList();
        }

        var eventosMostrar = eventos
        .Select(e => new VistaEventos
        {
            EventoID = e.EventoID,
            AnimalID = e.AnimalID,
            EstadoID = e.EstadoID,
            AnimalCaravana = e.Animal.Caravana,
            EstadoDescripcion = e.Estado.Descripcion,
            FechaEvento = e.FechaEvento,
            FechaEventoString = e.FechaEvento.ToString("dd/MM/yyyy"),
            Observacion = e.Observacion

        })
        .ToList();

        return Json(eventosMostrar);
    }

    public JsonResult GuardarEventos(int eventoID, int animalID, int estadoID, DateTime fechaEvento, string observacion)
    {

        if (eventoID == 0)
        {
            var evento = new Evento
            {
                AnimalID = animalID,
                EstadoID = estadoID,
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
                eventoEditar.EstadoID = estadoID;
                eventoEditar.FechaEvento = fechaEvento;
                eventoEditar.Observacion = observacion;

                _context.SaveChanges();
            }
        }
        return Json(true);
    }

    public JsonResult EliminarEvento(int eventoID)
    {
        var evento = _context.Eventos.Find(eventoID);
        _context.Remove(evento);
        _context.SaveChanges();

        return Json(true);
    }
}


