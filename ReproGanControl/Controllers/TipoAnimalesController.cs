using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;

namespace ReproGanControl.Controllers;

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
    
        string resultado = "";

        if (!String.IsNullOrEmpty(descripcion))
        {
            descripcion = descripcion.ToUpper();
         
            if (tipoAnimalID == 0)
            {
                var existeTipoAnimal = _context.TipoAnimales.Where(t => t.Descripcion == descripcion).Count();
                if (existeTipoAnimal == 0)
                {
                    var tipoAnimal = new TipoAnimal
                    {
                        Descripcion = descripcion
                    };
                    _context.Add(tipoAnimal);
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "YA EXISTE UN ANIMAL CON LA MISMA DESCRIPCIÓN";
                }
            }
            else
            {
                var tipoAnimalEditar = _context.TipoAnimales.Where(t => t.TipoAnimalID == tipoAnimalID).SingleOrDefault();
                if (tipoAnimalEditar != null)
                {
                    var existeTipoAnimal = _context.TipoAnimales.Where(t => t.Descripcion == descripcion && t.TipoAnimalID != tipoAnimalID).Count();
                    if (existeTipoAnimal == 0)
                    {
                        tipoAnimalEditar.Descripcion = descripcion;
                        _context.SaveChanges();
                    }
                    else
                    {
                        resultado = "YA EXISTE UN ANIMAL CON LA MISMA DESCRIPCIÓN";
                    }
                }
            }
        }
        else
        {
            resultado = "DEBE INGRESAR UNA DESCRIPCIÓN.";
        }

        return Json(resultado);
    }

    public JsonResult EliminarTipoAnimal (int tipoAnimalID)
    {
        var eliminarTipoAnimal = _context.TipoAnimales.Find(tipoAnimalID);
        _context.Remove(eliminarTipoAnimal);
        _context.SaveChanges();

        return Json(true);
    }

 }