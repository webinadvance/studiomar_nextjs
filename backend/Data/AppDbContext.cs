using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Scadenze> Scadenze { get; set; }
    public DbSet<Clienti> Clienti { get; set; }
    public DbSet<Utenti> Utenti { get; set; }
    public DbSet<ScadenzeClienti> ScadenzeClienti { get; set; }
    public DbSet<ScadenzeUtenti> ScadenzeUtenti { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships if needed
        modelBuilder.Entity<ScadenzeClienti>()
            .HasOne(sc => sc.Scadenza)
            .WithMany(s => s.ScadenzeClienti)
            .HasForeignKey(sc => sc.ScadenzaId);

        modelBuilder.Entity<ScadenzeClienti>()
            .HasOne(sc => sc.Cliente)
            .WithMany()
            .HasForeignKey(sc => sc.ClienteId);

        modelBuilder.Entity<ScadenzeUtenti>()
            .HasOne(su => su.Scadenza)
            .WithMany(s => s.ScadenzeUtenti)
            .HasForeignKey(su => su.ScadenzaId);

        modelBuilder.Entity<ScadenzeUtenti>()
            .HasOne(su => su.Utente)
            .WithMany()
            .HasForeignKey(su => su.UtenteId);
    }
}