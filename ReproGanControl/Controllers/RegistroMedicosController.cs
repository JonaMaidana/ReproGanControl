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
        return View();
    }

    public JsonResult ListadoRegistrosMedicos(int? id)
    {
        var registroMedico = _context.RegistroMedicos.Include(a => a.Animal).ToList();
        if (id != null)
        {
            registroMedico = registroMedico.Where(t => t.RegistroMedicoID == id).ToList();
        }

        var registroMedicoMostrar = registroMedico
        .Select(r => new VistaRegistroMedico
        {
            RegistroMedicoID = r.RegistroMedicoID,
            AnimalID = r.AnimalID,
            AnimalCaravana = r.Animal.Caravana,
            Fecha = r.Fecha,
            FechaString = r.Fecha.ToString("dd/MM/yyyy"),
            Tratamiento = r.Tratamiento,
            Observacion = string.IsNullOrEmpty(r.Observacion) ? "NINGUNA" : r.Observacion,
            Enfermedad = r.Enfermedad,
        })
        .ToList();

        return Json(registroMedicoMostrar);
    }

     public JsonResult GuardarRegistrosMedicos(int registroMedicoID, int animalID, DateTime fecha, string enfermedad, string tratamiento, string observacion)
    {

       


        observacion = string.IsNullOrEmpty(observacion) ? "NINGUNA" : observacion;

        if (registroMedicoID == 0)
        {
            var registroMedico = new RegistroMedico
            {
                AnimalID = animalID,
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

}