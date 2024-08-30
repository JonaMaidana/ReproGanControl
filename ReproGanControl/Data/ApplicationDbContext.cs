using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReproGanControl.Models;

namespace ReproGanControl.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    
    public DbSet<Animal> Animales { get; set; }
    public DbSet<Evento> Eventos { get; set; }
    public DbSet<Localidad> Localidades { get; set; }
    public DbSet<Persona> Personas { get; set; }
    public DbSet<Provincia> Provincias { get; set; }
    public DbSet<RegistroMedico> RegistroMedicos { get; set; }
    public DbSet<TipoAnimal> TipoAnimales { get; set; }
}
