using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/utenti")]
public class UtentiController : ControllerBase
{
    private readonly AppDbContext _context;

    public UtentiController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUtenti([FromQuery] string? filter)
    {
        var query = _context.Utenti.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(filter))
        {
            var lowerFilter = filter.ToLower();
            query = query.Where(u => 
                (u.Nome != null && u.Nome.ToLower().Contains(lowerFilter)) ||
                (u.Cognome != null && u.Cognome.ToLower().Contains(lowerFilter))
            );
        }
        
        var utenti = await query.ToListAsync();
        return Ok(utenti);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUtente(int id)
    {
        var utente = await _context.Utenti.FindAsync(id);
        if (utente == null) return NotFound();
        return Ok(utente);
    }

    public class CreateUtenteRequest
    {
        public string? Nome { get; set; }
        public string? Cognome { get; set; }
        public string? Email { get; set; }
    }

    public class UpdateUtenteRequest
    {
        public string? Nome { get; set; }
        public string? Cognome { get; set; }
        public string? Email { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateUtente([FromBody] CreateUtenteRequest request)
    {
        var utente = new Utenti
        {
            Nome = request.Nome ?? string.Empty,
            Cognome = request.Cognome ?? string.Empty,
            Email = request.Email ?? string.Empty,
            IsActive = true,
            InsDate = DateTime.UtcNow,
            ModDate = DateTime.UtcNow
        };
        _context.Utenti.Add(utente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUtente), new { id = utente.Id }, utente);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUtente(int id, [FromBody] UpdateUtenteRequest request)
    {
        var utente = await _context.Utenti.FindAsync(id);
        if (utente == null) return NotFound();
        
        if (request.Nome != null) utente.Nome = request.Nome;
        if (request.Cognome != null) utente.Cognome = request.Cognome;
        if (request.Email != null) utente.Email = request.Email;
        utente.ModDate = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUtente(int id)
    {
        var utente = await _context.Utenti.FindAsync(id);
        if (utente == null) return NotFound();
        _context.Utenti.Remove(utente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}