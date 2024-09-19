using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ReproGanControl.Controllers;
[Authorize]
public class ProvinciasController : Controller
{
    private ApplicationDbContext _context;

    //CONSTRUCTOR
    public ProvinciasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult ListadoProvincia(int? id, string BuscarProvincia)
    {
        var provincias = _context.Provincias.AsQueryable();

        if (id != null)
        {
            provincias = provincias.Where(t => t.ProvinciaID == id);
        }

        if (!string.IsNullOrEmpty(BuscarProvincia))
        {
            var buscarProvinciaUpper = BuscarProvincia.ToUpper();
            provincias = provincias.Where(p => !string.IsNullOrEmpty(p.Nombre) && p.Nombre.ToUpper().Contains(buscarProvinciaUpper));
        }

        provincias = provincias.OrderBy(n => n.Nombre);
        return Json(provincias);
    }

    public JsonResult CrearProvincia(int provinciaID, string nombre)
    {
        string resultado = "";

        if (string.IsNullOrWhiteSpace(nombre))
        {
            return Json("DEBE INGRESAR UN NOMBRE.");
        }

        nombre = nombre.ToUpper();

        if (provinciaID == 0)
        {
            // Crear nueva provincia
            bool existeProvincia = _context.Provincias.Any(t => t.Nombre == nombre);
            if (!existeProvincia)
            {
                var provincia = new Provincia
                {
                    Nombre = nombre
                };
                _context.Provincias.Add(provincia);
                _context.SaveChanges();
            }
            else
            {
                resultado = "Ya existe una provincia con el mismo nombre";
            }
        }
        else
        {
            // Editar provincia existente
            var provinciaEditar = _context.Provincias.SingleOrDefault(t => t.ProvinciaID == provinciaID);
            if (provinciaEditar != null)
            {
                bool existeProvincia = _context.Provincias.Any(t => t.Nombre == nombre && t.ProvinciaID != provinciaID);
                if (!existeProvincia)
                {
                    provinciaEditar.Nombre = nombre;
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "Ya existe una provincia con el mismo nombre";
                }
            }
            else
            {
                resultado = "Provincia no encontrada.";
            }
        }

        return Json(resultado);
    }

    public JsonResult EliminarProvincia(int provinciaID)
    {
        var provincia = _context.Provincias.Find(provinciaID);

        var localidadesAsociadas = _context.Localidades.Any(e => e.ProvinciaID == provinciaID);

        if (localidadesAsociadas)
        {
            return Json("No se puede eliminar la provincia porque esta asociado a una localidad");
        }
        _context.Remove(provincia);
        _context.SaveChanges();

        return Json(true);
    }
}