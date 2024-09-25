using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReproGanControl.Data;

public class MigrationController : Controller
{
    private readonly ApplicationDbContext _context;

    public MigrationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult RunMigrations()
    {
        // Aplica las migraciones pendientes
        _context.Database.Migrate();

        return Content("Migraciones ejecutadas correctamente.");
    }
}