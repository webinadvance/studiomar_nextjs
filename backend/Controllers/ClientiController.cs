using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/clienti")]
public class ClientiController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientiController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetClienti([FromQuery] string? filter)
    {
        var query = _context.Clienti.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(filter))
        {
            var lowerFilter = filter.ToLower();
            query = query.Where(c => c.Name != null && c.Name.ToLower().Contains(lowerFilter));
        }
        
        var clienti = await query.ToListAsync();
        return Ok(clienti);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCliente(int id)
    {
        var cliente = await _context.Clienti.FindAsync(id);
        if (cliente == null) return NotFound();
        return Ok(cliente);
    }

    public class CreateClienteRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateClienteRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCliente([FromBody] CreateClienteRequest request)
    {
        var cliente = new Clienti
        {
            Name = request.Name,
            IsActive = true,
            InsDate = DateTime.UtcNow,
            ModDate = DateTime.UtcNow
        };
        _context.Clienti.Add(cliente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCliente(int id, [FromBody] UpdateClienteRequest request)
    {
        var cliente = await _context.Clienti.FindAsync(id);
        if (cliente == null) return NotFound();
        
        cliente.Name = request.Name;
        cliente.ModDate = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var cliente = await _context.Clienti.FindAsync(id);
        if (cliente == null) return NotFound();
        _context.Clienti.Remove(cliente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}