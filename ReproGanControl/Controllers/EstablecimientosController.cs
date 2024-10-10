using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ReproGanControl.Controllers;

// [Authorize]
public class EstablecimientosController : Controller
{
    private ApplicationDbContext _context;

    //Constructor
    public EstablecimientosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public ActionResult Index()
    {
        var localidades = _context.Localidades.ToList();
        localidades.Insert(0, new Localidad { LocalidadID = 0, NombreLocalidad = "[SELECCIONE]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(n => n.NombreLocalidad), "LocalidadID", "NombreLocalidad");

        var provincias = _context.Provincias.ToList();
        provincias.Insert(0, new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(n => n.Nombre), "ProvinciaID", "Nombre");
        return View();
    }

    public JsonResult ListadoEstablecimientos(int? id)
    {
        var establecimientos = _context.Establecimientos.ToList();

        if (id != null)
        {
            establecimientos = establecimientos.Where(t => t.EstablecimientoID == id).ToList();
        }

        return Json(establecimientos);
    }

    public JsonResult MostrarEstablecimientos(int? id)
    {
        var establecimiento = _context.Establecimientos.Include(l => l.Localidad).ThenInclude(l => l.Provincia).AsQueryable();
        if (id != null)
        {
            establecimiento = establecimiento.Where(e => e.EstablecimientoID == id);
        }
        var establecimientosMostrar = establecimiento
        .Select(e => new VistaEstablecimientos
        {
            EstablecimientoID = e.EstablecimientoID,
            LocalidadID = e.LocalidadID,
            ProvinciaID = e.Localidad.ProvinciaID,
            NombreEstablecimiento = e.NombreEstablecimiento,
            NombreLocalidad = e.Localidad.NombreLocalidad,
            NombreProvincia = e.Localidad.Provincia.Nombre,
        })
        .ToList();
        return Json(establecimientosMostrar);
    }

    public JsonResult TraerLocalidades(int provinciaID)
    {
        IEnumerable<Localidad> localidades;
        if (provinciaID == 0)
        {
            localidades = _context.Localidades.ToList();
        }
        else
        {
            localidades = _context.Localidades.Where(p => p.ProvinciaID == provinciaID).ToList();
        }
        var resultado = localidades.Select(l => new { l.LocalidadID, l.NombreLocalidad }).ToList();
        return Json(resultado);
    }

    public JsonResult CrearEstablecimientos(int establecimientoID, string nombreEstablecimiento, int localidadID)
{
    nombreEstablecimiento = nombreEstablecimiento.ToUpper();

    // Verificar si ya existe un establecimiento con el mismo nombre
    var establecimientoExistente = _context.Establecimientos
        .FirstOrDefault(e => e.NombreEstablecimiento == nombreEstablecimiento && e.LocalidadID == localidadID);

    if (establecimientoExistente != null && establecimientoExistente.EstablecimientoID != establecimientoID)
    {
        // Si el nombre ya existe, devolver un error
        return Json(new { success = false, message = "Ya existe un establecimiento con el mismo nombre en esta localidad." });
    }

    if (establecimientoID == 0)
    {
        var establecimiento = new Establecimiento
        {
            LocalidadID = localidadID,
            NombreEstablecimiento = nombreEstablecimiento,
        };
        _context.Add(establecimiento);
        _context.SaveChanges();
    }
    else
    {
        var establecimientoEditar = _context.Establecimientos.SingleOrDefault(p => p.EstablecimientoID == establecimientoID);
        if (establecimientoEditar != null)
        {
            establecimientoEditar.LocalidadID = localidadID;
            establecimientoEditar.NombreEstablecimiento = nombreEstablecimiento;

            _context.SaveChanges();
        }
    }

    return Json(new { success = true });
}

    public JsonResult EliminarEstablecimientos(int establecimientoID)
    {
        bool isInUse = _context.Animales.Where(o => o.EstablecimientoID == establecimientoID).Any();

        if (isInUse)
        {
            return Json(new { success = false, message = "El Establecimiento está en uso en otra parte y no puede ser eliminada." });
        }

        var establecimiento = _context.Establecimientos.Find(establecimientoID);

        if (establecimiento == null)
        {
            return Json(new { success = false, message = "Establecimiento no encontrado." });
        }

        _context.Establecimientos.Remove(establecimiento);
        _context.SaveChanges();

        return Json(new { success = true, message = "El Establecimiento fue eliminado exitosamente." });
    }
}