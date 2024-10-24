using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ReproGanControl.Controllers;
 [Authorize(Roles = "ADMINISTRADOR")]
public class LocalidadesController : Controller
{
    private ApplicationDbContext _context;

    //CONSTRUCTOR
    public LocalidadesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var provincias = _context.Provincias.ToList();

        provincias.Add(new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(d => d.Nombre), "ProvinciaID", "Nombre");
        return View();
    }
    public JsonResult ListadoLocalidades(int? id, string BuscarLocalidad)
    {
        // Evitar el uso de ToList antes de aplicar filtros y manipulación
        var localidades = _context.Localidades.Include(p => p.Provincia).AsQueryable();

        // Aplicar filtro si es necesario
        if (id != null)
        {
            localidades = localidades.Where(l => l.LocalidadID == id);
        }

         if (!string.IsNullOrEmpty(BuscarLocalidad))
        {
            var BuscarLocalidadUpper = BuscarLocalidad.ToUpper();
            localidades = localidades.Where(p => !string.IsNullOrEmpty(p.NombreLocalidad) && p.NombreLocalidad.ToUpper().Contains(BuscarLocalidadUpper));
        }

        // Selección de datos proyectados y ordenamiento
        var localidadesMostrar = localidades
            .Select(l => new VistaLocalidades
            {
                LocalidadID = l.LocalidadID,
                ProvinciaID = l.ProvinciaID,
                NombreLocalidad = l.NombreLocalidad,
                ProvinciaNombre = l.Provincia.Nombre,
                CodigoPostal = l.CodigoPostal,
            })
            .OrderBy(n => n.NombreLocalidad)
            .ToList();

        return Json(localidadesMostrar);
    }

    // Guardar o editar localidad
    public JsonResult GuardarLocalidades(int localidadID, int provinciaID, string? nombreLocalidad, string? codigoPostal)
    {
        // Verificar si ya existe una localidad con el mismo código postal y nombre
        bool existeLocalidad = _context.Localidades.Any(a => a.CodigoPostal == codigoPostal && a.NombreLocalidad == nombreLocalidad && a.LocalidadID != localidadID);

        if (existeLocalidad)
        {
            return Json(new { success = false, message = "No se puede crear la localidad porque ya existe una con el mismo nombre y código postal." });
        }

        // Normalizar los datos a mayúsculas
        codigoPostal = codigoPostal?.ToUpper();
        nombreLocalidad = nombreLocalidad?.ToUpper();

        // Crear o actualizar la localidad
        if (localidadID == 0)
        {
            var nuevaLocalidad = new Localidad
            {
                ProvinciaID = provinciaID,
                NombreLocalidad = nombreLocalidad,
                CodigoPostal = codigoPostal
            };

            _context.Localidades.Add(nuevaLocalidad);
            _context.SaveChanges();
        }
        else
        {
            var localidadEditar = _context.Localidades.Find(localidadID);
            if (localidadEditar != null)
            {
                localidadEditar.ProvinciaID = provinciaID;
                localidadEditar.NombreLocalidad = nombreLocalidad;
                localidadEditar.CodigoPostal = codigoPostal;

                _context.SaveChanges();
            }
        }

        return Json(new { success = true });
    }

    // Eliminar localidad
    public JsonResult EliminarLocalidades(int localidadID)
    {
        // Verificar si la localidad está en uso en otras tablas
        bool isInUse = _context.Personas.Any(o => o.LocalidadID == localidadID);

        if (isInUse)
        {
            return Json(new { success = false, message = "La localidad esta relacionado a personas, pro lo tanto no puede ser eliminada." });
        }

        var localidad = _context.Localidades.Find(localidadID);

        if (localidad == null)
        {
            return Json(new { success = false, message = "Localidad no encontrada." });
        }

        _context.Localidades.Remove(localidad);
        _context.SaveChanges();

        return Json(new { success = true });
    }
}
