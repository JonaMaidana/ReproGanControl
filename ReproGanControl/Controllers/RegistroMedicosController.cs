using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ReproGanControl.Controllers;
[Authorize]
public class RegistroMedicosController : Controller
{
    private ApplicationDbContext _context;

    //CONSTRUCTOR
    public RegistroMedicosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Obtener todos los animales
        var animales = _context.Animales.ToList();
        animales.Add(new Animal { AnimalID = 0, Caravana = "[SELECCIONE]" });
        ViewBag.AnimalID = new SelectList(animales.OrderBy(d => d.Caravana), "AnimalID", "Caravana");

        var personas = _context.Personas.ToList();
        personas.Add(new Persona { PersonaID = 0, NombreCompleto = "[SELECCIONE]" });
        ViewBag.PersonaID = new SelectList(personas.OrderBy(n => n.NombreCompleto), "PersonaID", "NombreCompleto");

        return View();
    }

    public JsonResult ListadoRegistrosMedicos(int? id, string BuscarCaravana)
    {
        var registroMedico = _context.RegistroMedicos.Include(a => a.Animal).Include(a => a.Persona).ToList();
        if (id != null)
        {
            registroMedico = registroMedico.Where(t => t.RegistroMedicoID == id).ToList();
        }

        if (!string.IsNullOrEmpty(BuscarCaravana))
        {
            var caravanaUpper = BuscarCaravana.ToUpper();
            registroMedico = registroMedico.Where(a => a.Animal.Caravana.ToUpper().Contains(caravanaUpper)).ToList();
        }

        var registroMedicoMostrar = registroMedico
        .Select(r => new VistaRegistroMedico
        {
            RegistroMedicoID = r.RegistroMedicoID,
            AnimalID = r.AnimalID,
            PersonaID = r.PersonaID,
            AnimalCaravana = r.Animal.Caravana,
            NombrePersona = r.Persona.NombreCompleto,
            Fecha = r.Fecha,
            FechaString = r.Fecha.ToString("dd/MM/yyyy"),
            Tratamiento = r.Tratamiento,
            Observacion = string.IsNullOrEmpty(r.Observacion) ? "NINGUNA" : r.Observacion,
            Enfermedad = r.Enfermedad,
        })
        .OrderByDescending(f => f.Fecha)
        .ToList();

        return Json(registroMedicoMostrar);
    }

    public JsonResult GuardarRegistrosMedicos(int registroMedicoID, int personaID, int animalID, DateTime fecha, string enfermedad, string tratamiento, string observacion)
    {

        enfermedad = enfermedad.ToUpper();
        tratamiento = tratamiento.ToUpper();
        observacion = string.IsNullOrEmpty(observacion) ? "NINGUNA" : observacion.ToUpper();

        if (registroMedicoID == 0)
        {
            var registroMedico = new RegistroMedico
            {
                AnimalID = animalID,
                PersonaID = personaID,
                Fecha = fecha,
                Enfermedad = enfermedad,
                Tratamiento = tratamiento,
                Observacion = observacion
            };
            _context.Add(registroMedico);
            _context.SaveChanges();

        }
        else
        {
            var registroMedicoEditar = _context.RegistroMedicos.Where(e => e.RegistroMedicoID == registroMedicoID).SingleOrDefault();
            if (registroMedicoEditar != null)
            {
                registroMedicoEditar.AnimalID = animalID;
                registroMedicoEditar.PersonaID = personaID;
                registroMedicoEditar.Fecha = fecha;
                registroMedicoEditar.Enfermedad = enfermedad;
                registroMedicoEditar.Tratamiento = tratamiento;
                registroMedicoEditar.Observacion = observacion;

                _context.SaveChanges();
            }
        }
        return Json(new { success = true });
    }

    public JsonResult EliminarRegistrosMedicos(int registroMedicoID)
    {
        var registroMedico = _context.RegistroMedicos.Find(registroMedicoID);
        _context.Remove(registroMedico);
        _context.SaveChanges();

        return Json(true);
    }


    public ActionResult InformeRegistroMedico()
    {
        var personasBuscar = _context.Personas.ToList();
        personasBuscar.Add(new Persona { PersonaID = 0, NombreCompleto = "[SELECCIONE]" });
        ViewBag.PersonasBuscarID = new SelectList(personasBuscar.OrderBy(n => n.NombreCompleto), "PersonaID", "NombreCompleto");

        return View();
    }
    public JsonResult ListadoInformeRegistroMedico(int? PersonasBuscarID, string? BuscarCaravanaInfo)
    {
        List<VistaInformeRegistroMedico> vistaInformeRegistroMedico = new List<VistaInformeRegistroMedico>();

        var registroMedico = _context.RegistroMedicos.Include(t => t.Persona).Include(t => t.Animal).ToList();

        // Filtro para buscar por Veterinario 
        if (PersonasBuscarID != null && PersonasBuscarID != 0)
        {
            registroMedico = registroMedico.Where(e => e.PersonaID == PersonasBuscarID).ToList();
        }

        if (!string.IsNullOrEmpty(BuscarCaravanaInfo))
        {
            var buscarCaravanaInfoUpper = BuscarCaravanaInfo.ToUpper();
            registroMedico = registroMedico.Where(a => a.Animal.Caravana.ToUpper().Contains(buscarCaravanaInfoUpper)).ToList();
        }

        foreach (var listadoRegistroMedico in registroMedico)
        {

            var registrosMedicosMostrar = vistaInformeRegistroMedico.FirstOrDefault(t => t.PersonaID == listadoRegistroMedico.PersonaID);
            if (registrosMedicosMostrar == null)
            {
                registrosMedicosMostrar = new VistaInformeRegistroMedico
                {
                    PersonaID = listadoRegistroMedico.PersonaID,
                    NombrePersona = listadoRegistroMedico.Persona.NombreCompleto,
                    vistaRegistroMedico = new List<VistaRegistroMedico>()
                };
                vistaInformeRegistroMedico.Add(registrosMedicosMostrar);
            }

            // Crear el registro médico para agregar al grupo
            var registroMedicoMostrar = new VistaRegistroMedico
            {
                AnimalCaravana = listadoRegistroMedico.Animal.Caravana,
                FechaString = listadoRegistroMedico.Fecha.ToString("dd/MM/yyyy"),
                Tratamiento = listadoRegistroMedico.Tratamiento,
                Observacion = string.IsNullOrEmpty(listadoRegistroMedico.Observacion) ? "NINGUNA" : listadoRegistroMedico.Observacion,
                Enfermedad = listadoRegistroMedico.Enfermedad,
            };

            registrosMedicosMostrar.vistaRegistroMedico.Add(registroMedicoMostrar);
        }

        return Json(vistaInformeRegistroMedico);
    }
}