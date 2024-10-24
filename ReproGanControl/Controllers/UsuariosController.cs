using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;

namespace ReproGanControl.Controllers;
[Authorize]
public class UsuariosController : Controller
{
    private ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    //CONSTRUCTOR
    public UsuariosController(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }
    [Authorize(Roles = "ADMINISTRADOR")]
    public IActionResult Usuarios()
    {
        return View();
    }

    public async Task<JsonResult> ListadoUsuarios()  // Cambia IActionResult a JsonResult
    {
        var usuarios = await _userManager.Users.ToListAsync();

        var vistaUsuarios = new List<VistaUsuario>();

        foreach (var usuario in usuarios)
        {
            var roles = await _userManager.GetRolesAsync(usuario);
            var rol = roles.FirstOrDefault();

            vistaUsuarios.Add(new VistaUsuario
            {
                UsuarioID = usuario.Id,
                Email = usuario.Email,
                Rol = rol
            });
        }

        return Json(vistaUsuarios);  // Retorna los datos como JSON para consumirlo con AJAX
    }

    [HttpPost]
    public async Task<JsonResult> CrearUsuario(string email, string password, string rol)
    {
        try
        {
            // Verificar si el email ya existe
            var usuarioExistente = await _userManager.FindByEmailAsync(email);
            if (usuarioExistente != null)
            {
                return Json(new { exito = false, mensaje = "El email ya está registrado" });
            }

            var usuario = new IdentityUser
            {
                UserName = email,
                Email = email
            };

            var resultado = await _userManager.CreateAsync(usuario, password);

            if (resultado.Succeeded)
            {
                // Asignar el rol al usuario
                await _userManager.AddToRoleAsync(usuario, rol);
                return Json(new { exito = true, mensaje = "Usuario creado exitosamente" });
            }

            return Json(new { exito = false, mensaje = "Error al crear el usuario: " + string.Join(", ", resultado.Errors.Select(e => e.Description)) });
        }
        catch (Exception ex)
        {
            return Json(new { exito = false, mensaje = "Error: " + ex.Message });
        }
    }

    // POST: Eliminar usuario
    [HttpPost]
    public async Task<JsonResult> EliminarUsuario(string usuarioId)
    {
        try
        {
            var usuario = await _userManager.FindByIdAsync(usuarioId);
            if (usuario == null)
            {
                return Json(new { exito = false, mensaje = "Usuario no encontrado" });
            }

            // Verificar que no sea el admin principal
            if (usuario.Email == "admin@ReproGan.com")
            {
                return Json(new { exito = false, mensaje = "No se puede eliminar al usuario administrador principal" });
            }

            var resultado = await _userManager.DeleteAsync(usuario);
            if (resultado.Succeeded)
            {
                return Json(new { exito = true, mensaje = "Usuario eliminado exitosamente" });
            }

            return Json(new { exito = false, mensaje = "Error al eliminar el usuario" });
        }
        catch (Exception ex)
        {
            return Json(new { exito = false, mensaje = "Error: " + ex.Message });
        }
    }
}

