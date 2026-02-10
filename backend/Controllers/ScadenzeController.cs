using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/scadenze")]
public class ScadenzeController : ControllerBase
{
    private readonly AppDbContext _context;

    public ScadenzeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetScadenze(
        [FromQuery] int? cliente_id,
        [FromQuery] int? utente_id,
        [FromQuery] string? filter,
        [FromQuery] string? date_start,
        [FromQuery] string? date_end)
    {
        var query = _context.Scadenze
            .Include(s => s.ScadenzeUtenti)
            .Include(s => s.ScadenzeClienti)
            .AsQueryable();

        if (cliente_id.HasValue)
        {
            query = query.Where(s => s.ScadenzeClienti.Any(sc => sc.ClienteId == cliente_id.Value));
        }

        if (utente_id.HasValue)
        {
            query = query.Where(s => s.ScadenzeUtenti.Any(su => su.UtenteId == utente_id.Value));
        }

        if (!string.IsNullOrEmpty(filter))
        {
            query = query.Where(s => s.Name.Contains(filter));
        }

        if (!string.IsNullOrEmpty(date_start) && DateTime.TryParse(date_start, out var startDate))
        {
            query = query.Where(s => s.Date >= startDate);
        }

        if (!string.IsNullOrEmpty(date_end) && DateTime.TryParse(date_end, out var endDate))
        {
            query = query.Where(s => s.Date <= endDate);
        }

        var scadenze = await query.ToListAsync();
        return Ok(scadenze);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetScadenza(int id)
    {
        var scadenza = await _context.Scadenze.FindAsync(id);
        if (scadenza == null) return NotFound();
        return Ok(scadenza);
    }

    [HttpPost]
    public async Task<IActionResult> CreateScadenza(Scadenze scadenza)
    {
        _context.Scadenze.Add(scadenza);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetScadenza), new { id = scadenza.Id }, scadenza);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateScadenza(int id, Scadenze scadenza)
    {
        if (id != scadenza.Id) return BadRequest();
        _context.Entry(scadenza).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteScadenza(int id)
    {
        var scadenza = await _context.Scadenze.FindAsync(id);
        if (scadenza == null) return NotFound();
        _context.Scadenze.Remove(scadenza);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}