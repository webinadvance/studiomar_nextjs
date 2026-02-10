using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://*:8080");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use PascalCase to match TypeScript interfaces
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<DataImportService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    app.UseDeveloperExceptionPage();
}

// Ensure database exists and seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Always ensure database is created (creates schema if not exists)
    db.Database.EnsureCreated();
    // Seed data if tables are empty
    SeedData(db);
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Test endpoint
app.MapGet("/test", () => "Hello from backend");

app.MapPost("/import-data", async (DataImportService service) =>
{
    await service.ImportDataAsync();
    return Results.Ok("Data imported successfully");
});

app.MapPost("/clear-credentials", (HttpContext context) =>
{
    context.Response.Cookies.Delete(".AspNetCore.Cookies");
    return Results.Ok();
});


app.Run();

static void SeedData(AppDbContext context)
{
    if (!context.Utenti.Any())
    {
        var utenti = new List<Utenti>
        {
            new Utenti { Email = "user1@example.com", Nome = "Mario", Cognome = "Rossi", InsDate = DateTime.UtcNow, IsActive = true },
            new Utenti { Email = "user2@example.com", Nome = "Luca", Cognome = "Bianchi", InsDate = DateTime.UtcNow, IsActive = true },
            new Utenti { Email = "user3@example.com", Nome = "Giulia", Cognome = "Verdi", InsDate = DateTime.UtcNow, IsActive = true }
        };
        context.Utenti.AddRange(utenti);
    }

    if (!context.Clienti.Any())
    {
        var clienti = new List<Clienti>
        {
            new Clienti { Name = "Cliente A", InsDate = DateTime.UtcNow, IsActive = true },
            new Clienti { Name = "Cliente B", InsDate = DateTime.UtcNow, IsActive = true },
            new Clienti { Name = "Cliente C", InsDate = DateTime.UtcNow, IsActive = true }
        };
        context.Clienti.AddRange(clienti);
    }

    context.SaveChanges();

    if (!context.Scadenze.Any())
    {
        var scadenze = new List<Scadenze>
        {
            new Scadenze { Name = "Scadenza 1", Date = DateTime.UtcNow.AddDays(10), Rec = 0, InsDate = DateTime.UtcNow, IsActive = true },
            new Scadenze { Name = "Scadenza 2", Date = DateTime.UtcNow.AddDays(20), Rec = 1, InsDate = DateTime.UtcNow, IsActive = true },
            new Scadenze { Name = "Scadenza 3", Date = DateTime.UtcNow.AddDays(30), Rec = 0, InsDate = DateTime.UtcNow, IsActive = true }
        };
        context.Scadenze.AddRange(scadenze);
        context.SaveChanges();

        // Assuming IDs are 1,2,3 for utenti and clienti
        var scadenzeUtenti = new List<ScadenzeUtenti>
        {
            new ScadenzeUtenti { ScadenzaId = 1, UtenteId = 1, InsDate = DateTime.UtcNow, IsActive = true },
            new ScadenzeUtenti { ScadenzaId = 1, UtenteId = 2, InsDate = DateTime.UtcNow, IsActive = true },
            new ScadenzeUtenti { ScadenzaId = 2, UtenteId = 3, InsDate = DateTime.UtcNow, IsActive = true }
        };
        context.ScadenzeUtenti.AddRange(scadenzeUtenti);

        var scadenzeClienti = new List<ScadenzeClienti>
        {
            new ScadenzeClienti { ScadenzaId = 1, ClienteId = 1, InsDate = DateTime.UtcNow, IsActive = true },
            new ScadenzeClienti { ScadenzaId = 2, ClienteId = 2, InsDate = DateTime.UtcNow, IsActive = true },
            new ScadenzeClienti { ScadenzaId = 3, ClienteId = 3, InsDate = DateTime.UtcNow, IsActive = true }
        };
        context.ScadenzeClienti.AddRange(scadenzeClienti);

        context.SaveChanges();
    }
}
