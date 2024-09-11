using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Reflection;
using System.ComponentModel.DataAnnotations;

namespace ReproGanControl.Controllers;
[Authorize]
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
        localidades.Add(new Localidad { LocalidadID = 0, Nombre = "[SELECCIONE]" });
        ViewBag.LocalidadID = new SelectList(localidades.OrderBy(n => n.Nombre), "LocalidadID", "Nombre");

        return View();
    }

    public JsonResult MostrarPersonas(int? id)
    {
        var personas = _context.Personas.Include(p => p.Localidad).AsQueryable();

        if (id != null)
        {
            personas = personas.Where(l => l.PersonaID == id);
        }

        var personasMostrar = personas
            .Select(p => new VistaPersona
            {
                PersonaID = p.PersonaID,
                LocalidadID = p.LocalidadID,
                NombreCompleto = p.NombreCompleto,
                NombreLocalidad = p.Localidad.Nombre,
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

    public JsonResult CrearPersonas(int personaID, int localidadID, string nombreCompleto,
    DateTime fechaNacimiento, string? email, string? tel, int numeroDocumento, string? domicilio)
    {
        bool existePersona = _context.Personas.Any(p => p.NumeroDocumento == numeroDocumento && p.Tel == tel && p.Email == email);
        if (existePersona)
        {
            return Json(new { success = false, message = "No se puede cargar la persona porque ya existe una con el mismo Nro Documento, Email, y Telefono." });
        }

    

        if (personaID == 0)
        {
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
        var persona = _context.Personas.Find(personaID); // Aquí estaba el error
        if (persona != null)
        {
            _context.Personas.Remove(persona);
            _context.SaveChanges();
            return Json(new { success = true });
        }

        return Json(new { success = false, message = "La persona no existe o ya fue eliminada." });
    }
}