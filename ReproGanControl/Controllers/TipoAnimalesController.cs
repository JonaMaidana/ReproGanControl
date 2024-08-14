using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;

namespace ReproGanControl.Controllers;
[Authorize]
public class TipoAnimalesController : Controller
{
    private ApplicationDbContext _context;

    public TipoAnimalesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult ListadoTipoAnimal(int? id)
    {
        var tipoDeAnimales = _context.TipoAnimales.ToList();

        if (id != null)
        {
            tipoDeAnimales = tipoDeAnimales.Where(t => t.TipoAnimalID == id).ToList();
        }

        return Json(tipoDeAnimales);
    }

public JsonResult GuardarTipoAnimal(int tipoAnimalID, string descripcion)
{
    if (string.IsNullOrEmpty(descripcion))
    {
        return Json(new { success = false, mensaje = "DEBE INGRESAR UNA DESCRIPCIÓN." });
    }

    descripcion = descripcion.ToUpper();
    
    if (tipoAnimalID == 0)
    {
        bool existeTipoAnimal = _context.TipoAnimales.Any(t => t.Descripcion == descripcion);
        if (!existeTipoAnimal)
        {
            var tipoAnimal = new TipoAnimal
            {
                Descripcion = descripcion
            };
            _context.Add(tipoAnimal);
            _context.SaveChanges();
            return Json(new { success = true, mensaje = "Tipo de animal guardado correctamente." });
        }
        else
        {
            return Json(new { success = false, mensaje = "YA EXISTE UN ANIMAL CON LA MISMA DESCRIPCIÓN." });
        }
    }
    else
    {
        var tipoAnimalEditar = _context.TipoAnimales.SingleOrDefault(t => t.TipoAnimalID == tipoAnimalID);
        if (tipoAnimalEditar != null)
        {
            bool existeTipoAnimal = _context.TipoAnimales.Any(t => t.Descripcion == descripcion && t.TipoAnimalID != tipoAnimalID);
            if (!existeTipoAnimal)
            {
                tipoAnimalEditar.Descripcion = descripcion;
                _context.SaveChanges();
                return Json(new { success = true, mensaje = "Tipo de animal guardado correctamente." });
            }
            else
            {
                return Json(new { success = false, mensaje = "YA EXISTE UN ANIMAL CON LA MISMA DESCRIPCIÓN." });
            }
        }
        else
        {
            return Json(new { success = false, mensaje = "Tipo de animal no encontrado." });
        }
    }
}


public JsonResult EliminarTipoAnimal(int tipoAnimalID)
{
    var tipoAnimal = _context.TipoAnimales.Find(tipoAnimalID);

    // Verificar si el tipo de animal está asociado a algún animal
    bool tieneAnimalesAsociados = _context.Animales.Any(a => a.TipoAnimalID == tipoAnimalID);

    if (tieneAnimalesAsociados)
    {
        // Si hay animales asociados, retornar un JSON indicando que no se puede eliminar
        return Json(new { success = false, mensaje = "Este tipo de animal no se puede eliminar porque está asociado a uno o más animales." });
    }

    if (tipoAnimal != null)
    {
        _context.TipoAnimales.Remove(tipoAnimal);
        _context.SaveChanges();
        // Retornar éxito si la eliminación fue exitosa
        return Json(new { success = true, mensaje = "Tipo de animal eliminado correctamente." });
    }

    // Retornar error si el tipo de animal no se encontró
    return Json(new { success = false, mensaje = "Tipo de animal no encontrado." });
}


 }