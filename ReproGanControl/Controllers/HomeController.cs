using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReproGanControl.Models;
using ReproGanControl.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ReproGanControl.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _rolManager;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _rolManager = rolManager;
        }

        public async Task<IActionResult> Index()
        {

            await CrearSuperusuario();


            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // Método para crear el superusuario y el rol ADMINISTRADOR
        private async Task CrearSuperusuario()
        {
            // Crear rol ADMINISTRADOR si no existe
            var nombreRolCrearExiste = await _context.Roles.Where(r => r.Name == "ADMINISTRADOR").SingleOrDefaultAsync();
            if (nombreRolCrearExiste == null)
            {
                await _rolManager.CreateAsync(new IdentityRole("ADMINISTRADOR"));
            }

            // Crear rol USUARIO si no existe
            var nombreRolUsuario = await _context.Roles.Where(r => r.Name == "USUARIO").SingleOrDefaultAsync();
            if (nombreRolUsuario == null)
            {
                await _rolManager.CreateAsync(new IdentityRole("USUARIO"));
            }

            // Crear el usuario superusuario
            bool creado = false;
            var usuario = await _context.Users.Where(u => u.Email == "admin@ReproGan.com").SingleOrDefaultAsync();
            if (usuario == null)
            {
                var user = new IdentityUser { UserName = "admin@ReproGan.com", Email = "admin@ReproGan.com" };
                var result = await _userManager.CreateAsync(user, "ReproGan@@");

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "ADMINISTRADOR");
                    creado = true;
                }
            }
        }
    }
}