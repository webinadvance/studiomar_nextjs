using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://*:8080");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<DataImportService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    // Migrate database
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
    }
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

app.MapPost("/clear-credentials", () =>
{
    // Clear cookie logic here
    return Results.Unauthorized();
});


app.Run();