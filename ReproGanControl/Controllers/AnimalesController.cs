using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Text.RegularExpressions;

namespace ReproGanControl.Controllers;
[Authorize]
public class AnimalesController : Controller
{
    private ApplicationDbContext _context;

    //CONSTRUCTOR
    public AnimalesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var tipoAnimales = _context.TipoAnimales.ToList();
        tipoAnimales.Add(new TipoAnimal { TipoAnimalID = 0, Descripcion = "[SELECCIONE]" });
        ViewBag.TipoAnimalID = new SelectList(tipoAnimales.OrderBy(d => d.Descripcion), "TipoAnimalID", "Descripcion");

        var buscarTipoAnimal = _context.TipoAnimales.ToList();
        buscarTipoAnimal.Add(new TipoAnimal { TipoAnimalID = 0, Descripcion = "[SELECCIONE]" });
        ViewBag.BuscarTipoAnimalID = new SelectList(buscarTipoAnimal.OrderBy(d => d.Descripcion), "TipoAnimalID", "Descripcion");

        var establecimientos = _context.Establecimientos.ToList();
        establecimientos.Add(new Establecimiento { EstablecimientoID = 0, NombreEstablecimiento = "[SELECCIONE]" });
        ViewBag.EstablecimientoID = new SelectList(establecimientos.OrderBy(n => n.NombreEstablecimiento), "EstablecimientoID", "NombreEstablecimiento");

        var buscarEstablecimiento = _context.Establecimientos.ToList();
        buscarEstablecimiento.Add(new Establecimiento { EstablecimientoID = 0, NombreEstablecimiento = "[SELECCIONE]" });
        ViewBag.BuscarEstablecimientoID = new SelectList(buscarEstablecimiento.OrderBy(n => n.NombreEstablecimiento), "EstablecimientoID", "NombreEstablecimiento");

        return View();
    }

    public JsonResult ListadoAnimales(int? id, int? BuscarTipoAnimalID, string? caravana, int? BuscarEstablecimientoID, string? BuscarApodo)
    {
        var animales = _context.Animales.Include(t => t.TipoAnimal).Include(e => e.Establecimiento).ToList();
        if (id != null)
        {
            animales = animales.Where(t => t.AnimalID == id).ToList();
        }

        if (BuscarTipoAnimalID != null && BuscarTipoAnimalID != 0)
        {
            animales = animales.Where(e => e.TipoAnimalID == BuscarTipoAnimalID).ToList();
        }

        if (!string.IsNullOrEmpty(caravana))
        {
            var caravanaUpper = caravana.ToUpper();
            animales = animales.Where(a => a.Caravana.ToUpper().Contains(caravanaUpper)).ToList();
        }

        if (!string.IsNullOrEmpty(BuscarApodo))
        {
            var buscarApodoUpper = BuscarApodo.ToUpper();
            animales = animales.Where(a => a.Apodo != null && a.Apodo.ToUpper().Contains(buscarApodoUpper)).ToList();
        }

        if (BuscarEstablecimientoID != null && BuscarEstablecimientoID != 0)
        {
            animales = animales.Where(e => e.EstablecimientoID == BuscarEstablecimientoID).ToList();
        }

        var animalesMostrar = animales
        .Select(a => new VistaAnimales
        {
            AnimalID = a.AnimalID,
            TipoAnimalID = a.TipoAnimalID,
            EstablecimientoID = a.EstablecimientoID,
            NombreEstablecimiento = a.Establecimiento.NombreEstablecimiento,
            TipoAnimalNombre = a.TipoAnimal.Descripcion,
            Caravana = a.Caravana,
            Apodo = string.IsNullOrEmpty(a.Apodo) ? "DESCONOCIDO" : a.Apodo,
            NombrePadre = string.IsNullOrEmpty(a.NombrePadre) ? "DESCONOCIDO" : a.NombrePadre,
            NombreMadre = string.IsNullOrEmpty(a.NombreMadre) ? "DESCONOCIDO" : a.NombreMadre,
            FechaNacimiento = a.FechaNacimiento,
            FechaNacimientoString = a.FechaNacimiento.ToString("dd/MM/yyyy"),
        })
        .OrderByDescending(a => a.AnimalID)
        .ToList();

        return Json(animalesMostrar);
    }

    public JsonResult GuardarAnimales(int animalID, int tipoAnimalID, int establecimientoID, string caravana, string apodo, string nombrePadre, string nombreMadre, DateTime fechaNacimiento)
    {
        bool existeCaravana = _context.Animales.Any(a => a.Caravana == caravana && a.AnimalID != animalID);
        if (existeCaravana)
        {
            return Json(new { success = false, message = "No se puede crear el animal porque ya existe uno con la misma caravana." });
        }

        apodo = string.IsNullOrEmpty(apodo) ? "" : apodo;
        nombrePadre = string.IsNullOrEmpty(nombrePadre) ? "DESCONOCIDO" : nombrePadre;
        nombreMadre = string.IsNullOrEmpty(nombreMadre) ? "DESCONOCIDO" : nombreMadre;

        apodo = apodo.ToUpper();
        caravana = caravana.ToUpper();
        nombrePadre = nombrePadre.ToUpper();
        nombreMadre = nombreMadre.ToUpper();

        if (animalID == 0)
        {
            var animal = new Animal
            {
                TipoAnimalID = tipoAnimalID,
                EstablecimientoID = establecimientoID,
                Caravana = caravana,
                Apodo = apodo,
                NombrePadre = nombrePadre,
                NombreMadre = nombreMadre,
                FechaNacimiento = fechaNacimiento
            };
            _context.Add(animal);
            _context.SaveChanges();
        }
        else
        {
            var animalEditar = _context.Animales.Where(t => t.AnimalID == animalID).SingleOrDefault();
            if (animalEditar != null)
            {
                animalEditar.TipoAnimalID = tipoAnimalID;
                animalEditar.Caravana = caravana;
                animalEditar.Apodo = apodo;
                animalEditar.NombrePadre = nombrePadre;
                animalEditar.NombreMadre = nombreMadre;
                animalEditar.EstablecimientoID = establecimientoID;
                animalEditar.FechaNacimiento = fechaNacimiento;

                _context.SaveChanges();
            }
        }
        return Json(new { success = true });
    }

    public JsonResult EliminarAnimales(int animalID)
    {
        // Verificar si el animal está en uso en otras tablas
        bool isInUse = _context.Eventos.Any(o => o.AnimalID == animalID);

        if (isInUse)
        {
            return Json(new { success = false, message = "El animal tiene un evento activo por lo cual no puede ser eliminado." });
        }

        var animal = _context.Animales.Find(animalID);

        if (animal == null)
        {
            return Json(new { success = false, message = "Animal no encontrado." });
        }

        _context.Animales.Remove(animal);
        _context.SaveChanges();

        return Json(new { success = true });
    }


    public ActionResult InformeAnimales()
    {
        var tiposAnimalesBuscar = _context.TipoAnimales.ToList();
        tiposAnimalesBuscar.Add(new TipoAnimal { TipoAnimalID = 0, Descripcion = "[SELECCIONE]" });
        ViewBag.TipoAnimalBuscarID = new SelectList(tiposAnimalesBuscar.OrderBy(c => c.Descripcion), "TipoAnimalID", "Descripcion");

        var establecimientoBuscar = _context.Establecimientos.ToList();
        establecimientoBuscar.Add(new Establecimiento{ EstablecimientoID = 0, NombreEstablecimiento ="[SELECCIONE]"});
        ViewBag.EstablecimientoBuscarID = new SelectList(establecimientoBuscar.OrderBy(n => n.NombreEstablecimiento ), "EstablecimientoID", "NombreEstablecimiento" );

        return View();
    }
    public JsonResult ListadoInformeAnimales(int? TipoAnimalBuscarID, int? EstablecimientoBuscarID)
    {
        List<VistaInformeAnimales> vistaInformeAnimales = new List<VistaInformeAnimales>();

        var animales = _context.Animales.Include(t => t.TipoAnimal).Include(e => e.Establecimiento).ToList();

        // Filtro para buscar por Tipo Animal 
        if (TipoAnimalBuscarID != null && TipoAnimalBuscarID != 0)
        {
            animales = animales.Where(e => e.TipoAnimalID == TipoAnimalBuscarID).ToList();
        }

        if (EstablecimientoBuscarID != null && EstablecimientoBuscarID != 0)
        {
            animales = animales.Where(e => e.EstablecimientoID == EstablecimientoBuscarID).ToList();
        }

        //filtro solo numeros
        // var regex = new Regex(@"\d+");
        // // Filtrar las caravanas que tienen solo números
        // animales = animales.Where(e => regex.IsMatch(e.Caravana)).ToList();

        // // Si también quieres ordenarlas por el valor numérico, puedes extraer los números y ordenarlas así:
        // animales = animales.OrderBy(e => int.Parse(regex.Match(e.Caravana).Value)).ToList();

        // Filtro para ordenar
        animales = animales.OrderBy(e => e.Caravana).ToList();

        foreach (var listadoAnimales in animales)
        {

            var tipoAnimalesMostrar = vistaInformeAnimales.Where(t => t.TipoAnimalID == listadoAnimales.TipoAnimalID).SingleOrDefault();
            if (tipoAnimalesMostrar == null)
            {
                tipoAnimalesMostrar = new VistaInformeAnimales
                {
                    TipoAnimalID = listadoAnimales.TipoAnimalID,
                    TipoAnimalNombre = listadoAnimales.TipoAnimal.Descripcion,
                    vistaAnimales = new List<VistaAnimales>()
                };
                vistaInformeAnimales.Add(tipoAnimalesMostrar);
            }

            var animalesMostrar = new VistaAnimales
            {
                Caravana = listadoAnimales.Caravana,
                Apodo = listadoAnimales.Apodo,
                EstablecimientoID = listadoAnimales.EstablecimientoID,
                NombreEstablecimiento = listadoAnimales.Establecimiento.NombreEstablecimiento,
                FechaNacimientoString = listadoAnimales.FechaNacimiento.ToString("dd/MM/yyyy"),
                NombrePadre = listadoAnimales.NombrePadre,
                NombreMadre = listadoAnimales.NombreMadre,
            };
            tipoAnimalesMostrar.vistaAnimales.Add(animalesMostrar);
        }

        return Json(vistaInformeAnimales);
    }

}

