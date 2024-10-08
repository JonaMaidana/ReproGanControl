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
        var establecimientoMostrar = establecimiento
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
        return Json(establecimientoMostrar);
    }

    public JsonResult GuardarEstablecimientos(int establecimientoID, string nombreEstablecimiento)
    {
        string resultado = "";

        if (!String.IsNullOrEmpty(nombreEstablecimiento))
        {
            nombreEstablecimiento = nombreEstablecimiento.ToUpper();

            if (establecimientoID == 0)
            {
                var existeEstablecimiento = _context.Establecimientos.Where(t => t.NombreEstablecimiento == nombreEstablecimiento).Count();
                if (existeEstablecimiento == 0)
                {
                    var establecimiento = new Establecimiento
                    {
                        NombreEstablecimiento = nombreEstablecimiento
                    };
                    _context.Add(establecimiento);
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "Ya existe un establecimiento con el mismo nombre";
                }
            }
            else
            {
                var establecimientoEditar = _context.Establecimientos.Where(t => t.EstablecimientoID == establecimientoID).SingleOrDefault();
                if (establecimientoEditar != null)
                {
                    var existeEstablecimientos = _context.Establecimientos.Where(t => t.NombreEstablecimiento == nombreEstablecimiento && t.EstablecimientoID != establecimientoID).Count();
                    if (existeEstablecimientos == 0)
                    {
                        establecimientoEditar.NombreEstablecimiento = nombreEstablecimiento;
                        _context.SaveChanges();
                    }
                    else
                    {
                        resultado = "Ya existe un establecimiento con el mismo nombre";
                    }
                }
            }
        }
        else
        {
            resultado = "Debe ingresar un establecimiento.";
        }

        return Json(resultado);
    }

    public JsonResult EliminarEstablecimientos(int establecimientoID)
    {
        var establecimiento = _context.Establecimientos.Find(establecimientoID);

        var establecimientoAsociadoEnAnimales = _context.Animales.Any(e => e.EstablecimientoID == establecimientoID);

        if (establecimientoAsociadoEnAnimales)
        {
            return Json("No se puede eliminar porque esta asociado a un Animal");
        }
        _context.Remove(establecimiento);
        _context.SaveChanges();

        return Json(true);
    }
}