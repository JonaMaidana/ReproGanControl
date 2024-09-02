using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        return View();
    }

    public JsonResult ListadoAnimales(int? id)
    {
        var animales = _context.Animales.Include(t => t.TipoAnimal).ToList();
        if (id != null)
        {
            animales = animales.Where(t => t.AnimalID == id).ToList();
        }

        var animalesMostrar = animales
        .Select(a => new VistaAnimales
        {
            AnimalID = a.AnimalID,
            TipoAnimalID = a.TipoAnimalID,
            TipoAnimalNombre = a.TipoAnimal.Descripcion,
            Caravana = a.Caravana,
            Apodo = string.IsNullOrEmpty(a.Apodo) ? "" : a.Apodo,
            NombrePadre = string.IsNullOrEmpty(a.NombrePadre) ? "DESCONOCIDO" : a.NombrePadre,
            NombreMadre = string.IsNullOrEmpty(a.NombreMadre) ? "DESCONOCIDO" : a.NombreMadre,
            Establecimiento = a.Establecimiento,
            FechaNacimiento = a.FechaNacimiento,
            FechaNacimientoString = a.FechaNacimiento.ToString("dd/MM/yyyy"),
            
        })
        .ToList();

        return Json(animalesMostrar);
    }

public JsonResult GuardarAnimales(int animalID, int tipoAnimalID, string caravana, string apodo, string nombrePadre, string nombreMadre, string establecimiento, DateTime fechaNacimiento)
{
    // Verificar si ya existe un animal con la misma caravana
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
    establecimiento = establecimiento.ToUpper();
    nombrePadre = nombrePadre.ToUpper();
    nombreMadre = nombreMadre.ToUpper();
    
    if (animalID == 0)
    {
        var animal = new Animal
        {
            TipoAnimalID = tipoAnimalID,
            Caravana = caravana,
            Apodo = apodo,
            NombrePadre = nombrePadre,
            NombreMadre = nombreMadre,
            Establecimiento = establecimiento,
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
            animalEditar.Establecimiento = establecimiento;
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
}
