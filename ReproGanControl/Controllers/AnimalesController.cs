using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReproGanControl.Data;
using ReproGanControl.Models;
using Microsoft.AspNetCore.Authorization;

namespace ReproGanControl.Controllers;
[Authorize]
public class AnimalesController : Controller
{
    private ApplicationDbContext _context;

    public AnimalesController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }
}