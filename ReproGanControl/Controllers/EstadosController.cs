using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;

namespace ReproGanControl.Controllers;
[Authorize]
public class EstadosController : Controller
{
    private ApplicationDbContext _context;

    public EstadosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult ListadoEstados(int? id)
    {
        var estados = _context.Estados.ToList();

        if (id != null)
        {
            estados = estados.Where(t => t.EstadoID == id).ToList();
        }

        return Json(estados);
    }

public JsonResult GuardarEstados(int estadoID, string descripcion)
{
    string resultado = "";
    bool exito = false;

    if (!String.IsNullOrEmpty(descripcion))
    {
        descripcion = descripcion.ToUpper();
     
        if (estadoID == 0)
        {
            var existeEstado = _context.Estados.Where(t => t.Descripcion == descripcion).Count();
            if (existeEstado == 0)
            {
                var estado = new Estado
                {
                    Descripcion = descripcion
                };
                _context.Add(estado);
                _context.SaveChanges();
                exito = true;
                resultado = "Estado guardado exitosamente.";
            }
            else
            {
                resultado = "YA EXISTE UN ESTADO CON LA MISMA DESCRIPCIÓN";
            }
        }
        else
        {
            var estadoEditar = _context.Estados.Where(t => t.EstadoID == estadoID).SingleOrDefault();
            if (estadoEditar != null)
            {
                var existeEstado = _context.Estados.Where(t => t.Descripcion == descripcion && t.EstadoID != estadoID).Count();
                if (existeEstado == 0)
                {
                    estadoEditar.Descripcion = descripcion;
                    _context.SaveChanges();
                    exito = true;
                    resultado = "Estado actualizado exitosamente.";
                }
                else
                {
                    resultado = "YA EXISTE UN ESTADO CON LA MISMA DESCRIPCIÓN";
                }
            }
        }
    }
    else
    {
        resultado = "DEBE INGRESAR UNA DESCRIPCIÓN.";
    }

    return Json(new { exito = exito, mensaje = resultado });
}

public JsonResult EliminarEstados(int estadoID)
{
    var eliminarEstado = _context.Estados.Find(estadoID);

    // Verifica si el estado está en uso en la tabla Eventos
    bool estaEnUso = _context.Eventos.Any(e => e.EstadoID == estadoID);

    if (estaEnUso)
    {
        return Json(new { exito = false });
    }

    if (eliminarEstado == null)
    {
        return Json(new { exito = false });
    }

    _context.Estados.Remove(eliminarEstado);
    _context.SaveChanges();

    return Json(new { exito = true });
}

 }