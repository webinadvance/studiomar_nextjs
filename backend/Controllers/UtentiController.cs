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
    public async Task<IActionResult> GetUtenti()
    {
        var utenti = await _context.Utenti.ToListAsync();
        return Ok(utenti);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUtente(int id)
    {
        var utente = await _context.Utenti.FindAsync(id);
        if (utente == null) return NotFound();
        return Ok(utente);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUtente(Utenti utente)
    {
        _context.Utenti.Add(utente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUtente), new { id = utente.Id }, utente);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUtente(int id, Utenti utente)
    {
        if (id != utente.Id) return BadRequest();
        _context.Entry(utente).State = EntityState.Modified;
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