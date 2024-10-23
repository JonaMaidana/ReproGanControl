﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ReproGanControl.Data;

#nullable disable

namespace ReproGanControl.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241023203110_SuperUser")]
    partial class SuperUser
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("ReproGanControl.Models.Animal", b =>
                {
                    b.Property<int>("AnimalID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AnimalID"));

                    b.Property<string>("Apodo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Caravana")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("EstablecimientoID")
                        .HasColumnType("int");

                    b.Property<DateTime>("FechaNacimiento")
                        .HasColumnType("datetime2");

                    b.Property<string>("NombreMadre")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NombrePadre")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TipoAnimalID")
                        .HasColumnType("int");

                    b.HasKey("AnimalID");

                    b.HasIndex("EstablecimientoID");

                    b.HasIndex("TipoAnimalID");

                    b.ToTable("Animales");
                });

            modelBuilder.Entity("ReproGanControl.Models.Establecimiento", b =>
                {
                    b.Property<int>("EstablecimientoID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EstablecimientoID"));

                    b.Property<int>("LocalidadID")
                        .HasColumnType("int");

                    b.Property<string>("NombreEstablecimiento")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("EstablecimientoID");

                    b.HasIndex("LocalidadID");

                    b.ToTable("Establecimientos");
                });

            modelBuilder.Entity("ReproGanControl.Models.Evento", b =>
                {
                    b.Property<int>("EventoID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EventoID"));

                    b.Property<int>("AnimalID")
                        .HasColumnType("int");

                    b.Property<string>("CausaAborto")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CausaRechazo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DetalleToro")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EspecifiqueOtro")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("EstadoCria")
                        .HasColumnType("int");

                    b.Property<DateTime?>("FechaAproximadaParicion")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("FechaAproximadaSecado")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("FechaEvento")
                        .HasColumnType("datetime2");

                    b.Property<string>("MotivoMuerte")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MotivoVenta")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Observacion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("TipoCria")
                        .HasColumnType("int");

                    b.Property<int>("TipoEvento")
                        .HasColumnType("int");

                    b.Property<int?>("TipoInseminacion")
                        .HasColumnType("int");

                    b.Property<string>("TipoParto")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ToroID")
                        .HasColumnType("int");

                    b.HasKey("EventoID");

                    b.HasIndex("AnimalID");

                    b.ToTable("Eventos");
                });

            modelBuilder.Entity("ReproGanControl.Models.Localidad", b =>
                {
                    b.Property<int>("LocalidadID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("LocalidadID"));

                    b.Property<string>("CodigoPostal")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NombreLocalidad")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProvinciaID")
                        .HasColumnType("int");

                    b.HasKey("LocalidadID");

                    b.HasIndex("ProvinciaID");

                    b.ToTable("Localidades");
                });

            modelBuilder.Entity("ReproGanControl.Models.Persona", b =>
                {
                    b.Property<int>("PersonaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PersonaID"));

                    b.Property<string>("Domicilio")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("FechaNacimiento")
                        .HasColumnType("datetime2");

                    b.Property<int>("LocalidadID")
                        .HasColumnType("int");

                    b.Property<string>("NombreCompleto")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NumeroDocumento")
                        .HasColumnType("int");

                    b.Property<string>("Tel")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("PersonaID");

                    b.HasIndex("LocalidadID");

                    b.ToTable("Personas");
                });

            modelBuilder.Entity("ReproGanControl.Models.Provincia", b =>
                {
                    b.Property<int>("ProvinciaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProvinciaID"));

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ProvinciaID");

                    b.ToTable("Provincias");
                });

            modelBuilder.Entity("ReproGanControl.Models.RegistroMedico", b =>
                {
                    b.Property<int>("RegistroMedicoID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RegistroMedicoID"));

                    b.Property<int>("AnimalID")
                        .HasColumnType("int");

                    b.Property<string>("Enfermedad")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<string>("ImagenBase64")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Observacion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PersonaID")
                        .HasColumnType("int");

                    b.Property<string>("Tratamiento")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RegistroMedicoID");

                    b.HasIndex("AnimalID");

                    b.HasIndex("PersonaID");

                    b.ToTable("RegistroMedicos");
                });

            modelBuilder.Entity("ReproGanControl.Models.TipoAnimal", b =>
                {
                    b.Property<int>("TipoAnimalID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TipoAnimalID"));

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TipoAnimalID");

                    b.ToTable("TipoAnimales");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ReproGanControl.Models.Animal", b =>
                {
                    b.HasOne("ReproGanControl.Models.Establecimiento", "Establecimiento")
                        .WithMany("Animales")
                        .HasForeignKey("EstablecimientoID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ReproGanControl.Models.TipoAnimal", "TipoAnimal")
                        .WithMany("Animales")
                        .HasForeignKey("TipoAnimalID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Establecimiento");

                    b.Navigation("TipoAnimal");
                });

            modelBuilder.Entity("ReproGanControl.Models.Establecimiento", b =>
                {
                    b.HasOne("ReproGanControl.Models.Localidad", "Localidad")
                        .WithMany("Establecimientos")
                        .HasForeignKey("LocalidadID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Localidad");
                });

            modelBuilder.Entity("ReproGanControl.Models.Evento", b =>
                {
                    b.HasOne("ReproGanControl.Models.Animal", "Animal")
                        .WithMany("Eventos")
                        .HasForeignKey("AnimalID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Animal");
                });

            modelBuilder.Entity("ReproGanControl.Models.Localidad", b =>
                {
                    b.HasOne("ReproGanControl.Models.Provincia", "Provincia")
                        .WithMany("Localidades")
                        .HasForeignKey("ProvinciaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Provincia");
                });

            modelBuilder.Entity("ReproGanControl.Models.Persona", b =>
                {
                    b.HasOne("ReproGanControl.Models.Localidad", "Localidad")
                        .WithMany("Personas")
                        .HasForeignKey("LocalidadID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Localidad");
                });

            modelBuilder.Entity("ReproGanControl.Models.RegistroMedico", b =>
                {
                    b.HasOne("ReproGanControl.Models.Animal", "Animal")
                        .WithMany("RegistroMedicos")
                        .HasForeignKey("AnimalID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ReproGanControl.Models.Persona", "Persona")
                        .WithMany("RegistrosMedicos")
                        .HasForeignKey("PersonaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Animal");

                    b.Navigation("Persona");
                });

            modelBuilder.Entity("ReproGanControl.Models.Animal", b =>
                {
                    b.Navigation("Eventos");

                    b.Navigation("RegistroMedicos");
                });

            modelBuilder.Entity("ReproGanControl.Models.Establecimiento", b =>
                {
                    b.Navigation("Animales");
                });

            modelBuilder.Entity("ReproGanControl.Models.Localidad", b =>
                {
                    b.Navigation("Establecimientos");

                    b.Navigation("Personas");
                });

            modelBuilder.Entity("ReproGanControl.Models.Persona", b =>
                {
                    b.Navigation("RegistrosMedicos");
                });

            modelBuilder.Entity("ReproGanControl.Models.Provincia", b =>
                {
                    b.Navigation("Localidades");
                });

            modelBuilder.Entity("ReproGanControl.Models.TipoAnimal", b =>
                {
                    b.Navigation("Animales");
                });
#pragma warning restore 612, 618
        }
    }
}
