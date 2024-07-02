using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReproGanControl.Data;
using ReproGanControl.Models;
using Microsoft.AspNetCore.Authorization;

namespace ReproGanControl.Controllers;
[Authorize]
public class AnimalesController : Controller
{
    private ApplicationDbContext _context;

    public AnimalesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


    public JsonResult ListadoAnimales()
    {
        var listadoAnimales = _context.Animales
            .Include(a => a.TipoAnimal)
            .Include(a => a.Estado)
            .Select(a => new
            {
                a.AnimalID,
                a.Caravana,
                TipoAnimal = a.TipoAnimal.Descripcion,
                Estado = a.Estado.Descripcion
            })
            .ToList();


        return Json(listadoAnimales);
    }

    public JsonResult GuardarAnimales(int animalID, string estadoDescripcion, string tipoAnimalDescripcion, string caravana)
    {
        string resultado = "";

        if (animalID == 0)
        {
            // Buscar el Estado por su descripción
            var estado = _context.Estados.FirstOrDefault(e => e.Descripcion == estadoDescripcion);

            if (estado == null)
            {
                //crea uno nuevo
                estado = new Estado { Descripcion = estadoDescripcion };
                _context.Estados.Add(estado);
                _context.SaveChanges();
            }

            // Buscar el Tipo Animal por su descripción
            var tipoAnimal = _context.TipoAnimales.FirstOrDefault(t => t.Descripcion == tipoAnimalDescripcion);

            if (tipoAnimal == null)
            {
                //crea uno nuevo
                tipoAnimal = new TipoAnimal { Descripcion = tipoAnimalDescripcion };
                _context.TipoAnimales.Add(tipoAnimal);
                _context.SaveChanges();
            }

            // crear el nuevo animal
            var nuevoAnimal = new Animal
            {
                EstadoID = estado.EstadoID,
                TipoAnimalID = tipoAnimal.TipoAnimalID,
                Caravana = caravana
            };

            _context.Animales.Add(nuevoAnimal);
            _context.SaveChanges();

            resultado = "Se ha creado con éxito";
        }

        return Json(resultado);
    }

public JsonResult EliminarAnimales(int animalID)
{
    var eliminarAnimal = _context.Animales.Find(animalID);
    _context.Animales.Remove(eliminarAnimal);
    _context.SaveChanges();

    return Json(true);
}
}