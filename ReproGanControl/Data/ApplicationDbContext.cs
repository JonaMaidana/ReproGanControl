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
    public DbSet<Establecimiento> Establecimientos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relación entre Establecimiento y Localidad
        modelBuilder.Entity<Establecimiento>()
            .HasOne(e => e.Localidad)
            .WithMany(l => l.Establecimientos)
            .HasForeignKey(e => e.LocalidadID)
            .OnDelete(DeleteBehavior.Restrict); // Evita ciclos de eliminación en cascada

        // Relación entre Localidad y Provincia
        modelBuilder.Entity<Localidad>()
            .HasOne(l => l.Provincia)
            .WithMany(p => p.Localidades)
            .HasForeignKey(l => l.ProvinciaID)
            .OnDelete(DeleteBehavior.Cascade); // Cambia según tus necesidades
    }
}

