using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// Get port from environment variable (Docker uses 8080), default to 5013 for production
var port = Environment.GetEnvironmentVariable("ASPNETCORE_HTTP_PORT") ?? "5013";
builder.WebHost.UseUrls($"http://*:{port}");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use PascalCase to match TypeScript interfaces
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS to allow frontend requests with credentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddScoped<DataImportService>();
builder.Services.AddScoped<SqlSeedService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    app.UseDeveloperExceptionPage();
}

// Ensure database exists and seed data from SQL file
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Always ensure database is created (creates schema if not exists)
    db.Database.EnsureCreated();

    // Seed data from SQL file
    var sqlSeedService = scope.ServiceProvider.GetRequiredService<SqlSeedService>();
    await sqlSeedService.SeedFromSqlAsync("/app/data/data.sql");
}

// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

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
