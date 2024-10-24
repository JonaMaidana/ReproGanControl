using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Reflection;
using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Controllers;
 [Authorize(Roles = "ADMINISTRADOR")]
public class PersonasController : Controller
{
    private ApplicationDbContext _context;

    //CONSTRUCTOR
    public PersonasController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var localidades = _context.Localidades.ToList();
        localidades.Insert(0, new Localidad { LocalidadID = 0, NombreLocalidad = "[SELECCIONE]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(n => n.NombreLocalidad), "LocalidadID", "NombreLocalidad");

        var provincias = _context.Provincias.ToList();
        provincias.Insert(0, new Provincia { ProvinciaID = 0, Nombre = "[SELECCIONE]" });
        ViewBag.ProvinciaID = new SelectList(provincias.OrderBy(n => n.Nombre), "ProvinciaID", "Nombre");

        return View();
    }
    public JsonResult TraerLocalidades(int provinciaId)
    {
        IEnumerable<Localidad> localidades;

        if (provinciaId == 0)
        {
            localidades = _context.Localidades.ToList();
        }
        else
        {
            localidades = _context.Localidades.Where(l => l.ProvinciaID == provinciaId).ToList();
        }

        var resultado = localidades.Select(l => new { l.LocalidadID, l.NombreLocalidad }).ToList();
        return Json(resultado);
    }

    public JsonResult MostrarPersonas(int? id)
    {
        var personas = _context.Personas.Include(l => l.Localidad).ThenInclude(loc => loc.Provincia).AsQueryable();

        if (id != null)
        {
            personas = personas.Where(l => l.PersonaID == id);
        }

        var personasMostrar = personas
            .Select(p => new VistaPersona
            {
                PersonaID = p.PersonaID,
                LocalidadID = p.LocalidadID,
                ProvinciaID = p.Localidad.ProvinciaID,
                NombreCompleto = p.NombreCompleto,
                NombreLocalidad = p.Localidad.NombreLocalidad,
                NombreProvincia = p.Localidad.Provincia.Nombre,
                Email = p.Email,
                Tel = p.Tel,
                NumeroDocumento = p.NumeroDocumento,
                FechaNacimiento = p.FechaNacimiento,
                FechaNacimientoString = p.FechaNacimiento.ToString("dd/MM/yyyy"),
                Domicilio = p.Domicilio,
            })
            .ToList();

        return Json(personasMostrar);
    }

    public JsonResult CrearPersonas(int personaID, int localidadID, string nombreCompleto, DateTime fechaNacimiento, string? email, string? tel, int numeroDocumento, string? domicilio)
    {

        nombreCompleto = nombreCompleto.ToUpper();
        domicilio = domicilio?.ToUpper();

        if (personaID == 0)
        {
            // Verificar si ya existe una persona con el mismo número de documento
            var personaExistente = _context.Personas.SingleOrDefault(p => p.NumeroDocumento == numeroDocumento);
            if (personaExistente != null)
            {
                return Json(new { success = false, message = "Ya existe una persona con el mismo número de documento." });
            }

            var persona = new Persona
            {
                LocalidadID = localidadID,
                NombreCompleto = nombreCompleto,
                FechaNacimiento = fechaNacimiento,
                Email = email,
                Tel = tel,
                NumeroDocumento = numeroDocumento,
                Domicilio = domicilio,
            };
            _context.Add(persona);
            _context.SaveChanges();
        }
        else
        {
            var personaEditar = _context.Personas.SingleOrDefault(p => p.PersonaID == personaID);
            if (personaEditar != null)
            {
                personaEditar.LocalidadID = localidadID;
                personaEditar.NombreCompleto = nombreCompleto;
                personaEditar.FechaNacimiento = fechaNacimiento;
                personaEditar.Email = email;
                personaEditar.Tel = tel;
                personaEditar.NumeroDocumento = numeroDocumento;
                personaEditar.Domicilio = domicilio;

                _context.SaveChanges();
            }
        }

        return Json(new { success = true });
    }

   public JsonResult EliminarPersonas(int personaID)
{
    // Verificar si la persona está en uso en otras tablas o relaciones
    bool isInUse = _context.RegistroMedicos.Where(o => o.PersonaID == personaID).Any(); // Ajusta "OtraTabla" según tu contexto

    if (isInUse)
    {
        return Json(new { success = false, message = "La persona está en uso en otra parte y no puede ser eliminada." });
    }

    var persona = _context.Personas.Find(personaID);

    if (persona == null)
    {
        return Json(new { success = false, message = "Persona no encontrada." });
    }

    _context.Personas.Remove(persona);
    _context.SaveChanges();

    return Json(new { success = true, message = "La persona fue eliminada exitosamente." });
}
}