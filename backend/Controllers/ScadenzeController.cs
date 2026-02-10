using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using System.Globalization;

namespace Backend.Controllers;

public class ScadenzaUtenteDto
{
    public int Id { get; set; }
    public int? UtenteId { get; set; }
    public int? ScadenzaId { get; set; }
    public string? Nome { get; set; }
    public string? Cognome { get; set; }
}

public class ScadenzaClienteDto
{
    public int Id { get; set; }
    public int? ClienteId { get; set; }
    public int? ScadenzaId { get; set; }
    public string? Name { get; set; }
}

public class ScadenzaResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? Date { get; set; }
    public DateTime? ScadenzaReale { get; set; }
    public int Rec { get; set; }
    public bool IsActive { get; set; }
    public DateTime? InsDate { get; set; }
    public DateTime? ModDate { get; set; }
    public int? InsUserId { get; set; }
    public List<ScadenzaUtenteDto> ScadenzeUtenti { get; set; } = new();
    public List<ScadenzaClienteDto> ScadenzeClienti { get; set; } = new();
}

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
        var query = _context.Scadenze.AsQueryable();

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
            var lowerFilter = filter.ToLower();
            query = query.Where(s => s.Name.ToLower().Contains(lowerFilter));
        }

        // Parse date filters for calculated date filtering
        DateTime? filterDateStart = null;
        DateTime? filterDateEnd = null;
        if (!string.IsNullOrEmpty(date_start) && DateTime.TryParse(date_start, out var startDate))
        {
            filterDateStart = startDate.Date;
        }
        if (!string.IsNullOrEmpty(date_end) && DateTime.TryParse(date_end, out var endDate))
        {
            filterDateEnd = endDate.Date;
        }

        var scadenzeRaw = await query
            .Select(s => new {
                s.Id,
                s.Name,
                s.Date,
                s.Rec,
                s.InsDate,
                s.ModDate,
                s.InsUserId,
                s.IsActive,
                ScadenzeUtenti = s.ScadenzeUtenti.Select(su => new ScadenzaUtenteDto
                {
                    Id = su.Id,
                    UtenteId = su.UtenteId,
                    ScadenzaId = su.ScadenzaId,
                    Nome = su.Utente.Nome,
                    Cognome = su.Utente.Cognome
                }),
                ScadenzeClienti = s.ScadenzeClienti.Select(sc => new ScadenzaClienteDto
                {
                    Id = sc.Id,
                    ClienteId = sc.ClienteId,
                    ScadenzaId = sc.ScadenzaId,
                    Name = sc.Cliente.Name
                })
            })
            .ToListAsync();

        // Calculate real date and filter by date range
        var today = DateTime.UtcNow.Date;
        var scadenze = scadenzeRaw
            .Select(s => {
                DateTime? scadenzaReale = s.Date;
                if (s.Date.HasValue && s.Rec > 0)
                {
                    var calcDate = s.Date.Value;
                    while (calcDate.Date < today)
                    {
                        calcDate = calcDate.AddMonths(s.Rec);
                    }
                    scadenzaReale = calcDate;
                }
                return new ScadenzaResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Date = s.Date,
                    ScadenzaReale = scadenzaReale,
                    Rec = s.Rec,
                    InsDate = s.InsDate,
                    ModDate = s.ModDate,
                    InsUserId = s.InsUserId,
                    IsActive = s.IsActive,
                    ScadenzeUtenti = s.ScadenzeUtenti.ToList(),
                    ScadenzeClienti = s.ScadenzeClienti.ToList()
                };
            })
            .Where(s => {
                if (!s.ScadenzaReale.HasValue) return false;
                var realDate = s.ScadenzaReale.Value.Date;
                if (filterDateStart.HasValue && realDate < filterDateStart.Value) return false;
                if (filterDateEnd.HasValue && realDate > filterDateEnd.Value) return false;
                return true;
            })
            .OrderBy(s => s.ScadenzaReale)
            .ToList();

        return Ok(scadenze);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetScadenza(int id)
    {
        var today = DateTime.UtcNow.Date;
        var scadenza = await _context.Scadenze
            .Where(s => s.Id == id)
            .Select(s => new {
                s.Id,
                s.Name,
                s.Date,
                s.Rec,
                s.InsDate,
                s.ModDate,
                s.InsUserId,
                s.IsActive,
                ScadenzeUtenti = s.ScadenzeUtenti.Select(su => new ScadenzaUtenteDto
                {
                    Id = su.Id,
                    UtenteId = su.UtenteId,
                    ScadenzaId = su.ScadenzaId,
                    Nome = su.Utente.Nome,
                    Cognome = su.Utente.Cognome
                }),
                ScadenzeClienti = s.ScadenzeClienti.Select(sc => new ScadenzaClienteDto
                {
                    Id = sc.Id,
                    ClienteId = sc.ClienteId,
                    ScadenzaId = sc.ScadenzaId,
                    Name = sc.Cliente.Name
                })
            })
            .FirstOrDefaultAsync();
        
        if (scadenza == null) return NotFound();
        
        // Calculate ScadenzaReale
        DateTime? scadenzaReale = scadenza.Date;
        if (scadenza.Date.HasValue && scadenza.Rec > 0)
        {
            var calcDate = scadenza.Date.Value;
            while (calcDate.Date < today)
            {
                calcDate = calcDate.AddMonths(scadenza.Rec);
            }
            scadenzaReale = calcDate;
        }
        
        var response = new ScadenzaResponse
        {
            Id = scadenza.Id,
            Name = scadenza.Name,
            Date = scadenza.Date,
            ScadenzaReale = scadenzaReale,
            Rec = scadenza.Rec,
            InsDate = scadenza.InsDate,
            ModDate = scadenza.ModDate,
            InsUserId = scadenza.InsUserId,
            IsActive = scadenza.IsActive,
            ScadenzeUtenti = scadenza.ScadenzeUtenti.ToList(),
            ScadenzeClienti = scadenza.ScadenzeClienti.ToList()
        };
        
        return Ok(response);
    }

    public class CreateScadenzaRequest
    {
        public string Name { get; set; } = string.Empty;
        public int Rec { get; set; }
        public string? Date { get; set; }
        public List<int>? UtenteIds { get; set; }
        public List<int>? ClienteIds { get; set; }
    }

    public class UpdateScadenzaRequest
    {
        public string? Name { get; set; }
        public int? Rec { get; set; }
        public string? Date { get; set; }
        public List<int>? UtenteIds { get; set; }
        public List<int>? ClienteIds { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateScadenza([FromBody] CreateScadenzaRequest request)
    {
        var scadenza = new Scadenze
        {
            Name = request.Name,
            Rec = request.Rec,
            Date = !string.IsNullOrEmpty(request.Date) ? DateTime.Parse(request.Date).ToUniversalTime() : null,
            IsActive = true,
            InsDate = DateTime.UtcNow,
            ModDate = DateTime.UtcNow
        };

        _context.Scadenze.Add(scadenza);
        await _context.SaveChangesAsync();

        // Add user relationships
        if (request.UtenteIds != null && request.UtenteIds.Any())
        {
            foreach (var utenteId in request.UtenteIds)
            {
                _context.ScadenzeUtenti.Add(new ScadenzeUtenti
                {
                    ScadenzaId = scadenza.Id,
                    UtenteId = utenteId,
                    IsActive = true,
                    InsDate = DateTime.UtcNow,
                    ModDate = DateTime.UtcNow
                });
            }
        }

        // Add client relationships
        if (request.ClienteIds != null && request.ClienteIds.Any())
        {
            foreach (var clienteId in request.ClienteIds)
            {
                _context.ScadenzeClienti.Add(new ScadenzeClienti
                {
                    ScadenzaId = scadenza.Id,
                    ClienteId = clienteId,
                    IsActive = true,
                    InsDate = DateTime.UtcNow,
                    ModDate = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();

        // Fetch with relations for response
        var savedScadenza = await _context.Scadenze
            .Include(s => s.ScadenzeUtenti)
                .ThenInclude(su => su.Utente)
            .Include(s => s.ScadenzeClienti)
                .ThenInclude(sc => sc.Cliente)
            .FirstOrDefaultAsync(s => s.Id == scadenza.Id);

        // Calculate ScadenzaReale
        DateTime? scadenzaReale = savedScadenza?.Date;
        if (savedScadenza?.Date.HasValue == true && savedScadenza.Rec > 0)
        {
            var calcDate = savedScadenza.Date.Value;
            var today = DateTime.UtcNow.Date;
            while (calcDate.Date < today)
            {
                calcDate = calcDate.AddMonths(savedScadenza.Rec);
            }
            scadenzaReale = calcDate;
        }

        // Build relation data for response
        var scadenzeUtenti = savedScadenza?.ScadenzeUtenti?
            .Select(su => new ScadenzaUtenteDto
            {
                Id = su.Id,
                UtenteId = su.UtenteId,
                ScadenzaId = su.ScadenzaId,
                Nome = su.Utente.Nome,
                Cognome = su.Utente.Cognome
            })
            .ToList() ?? new List<ScadenzaUtenteDto>();
        var scadenzeClienti = savedScadenza?.ScadenzeClienti?
            .Select(sc => new ScadenzaClienteDto
            {
                Id = sc.Id,
                ClienteId = sc.ClienteId,
                ScadenzaId = sc.ScadenzaId,
                Name = sc.Cliente.Name
            })
            .ToList() ?? new List<ScadenzaClienteDto>();

        var response = new ScadenzaResponse
        {
            Id = savedScadenza!.Id,
            Name = savedScadenza!.Name,
            Date = savedScadenza!.Date,
            ScadenzaReale = scadenzaReale,
            Rec = savedScadenza!.Rec,
            IsActive = savedScadenza!.IsActive,
            InsDate = savedScadenza!.InsDate,
            ModDate = savedScadenza!.ModDate,
            InsUserId = savedScadenza!.InsUserId,
            ScadenzeUtenti = scadenzeUtenti,
            ScadenzeClienti = scadenzeClienti
        };

        return CreatedAtAction(nameof(GetScadenza), new { id = savedScadenza.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateScadenza(int id, [FromBody] UpdateScadenzaRequest request)
    {
        var scadenza = await _context.Scadenze
            .Include(s => s.ScadenzeUtenti)
            .Include(s => s.ScadenzeClienti)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (scadenza == null) return NotFound();

        // Update basic fields
        if (request.Name != null) scadenza.Name = request.Name;
        if (request.Rec.HasValue) scadenza.Rec = request.Rec.Value;
        if (request.Date != null) scadenza.Date = DateTime.Parse(request.Date).ToUniversalTime();
        scadenza.ModDate = DateTime.UtcNow;

        // Update user relationships
        if (request.UtenteIds != null)
        {
            // Remove existing relationships
            _context.ScadenzeUtenti.RemoveRange(scadenza.ScadenzeUtenti);

            // Add new relationships
            foreach (var utenteId in request.UtenteIds)
            {
                _context.ScadenzeUtenti.Add(new ScadenzeUtenti
                {
                    ScadenzaId = scadenza.Id,
                    UtenteId = utenteId,
                    IsActive = true,
                    InsDate = DateTime.UtcNow,
                    ModDate = DateTime.UtcNow
                });
            }
        }

        // Update client relationships
        if (request.ClienteIds != null)
        {
            // Remove existing relationships
            _context.ScadenzeClienti.RemoveRange(scadenza.ScadenzeClienti);

            // Add new relationships
            foreach (var clienteId in request.ClienteIds)
            {
                _context.ScadenzeClienti.Add(new ScadenzeClienti
                {
                    ScadenzaId = scadenza.Id,
                    ClienteId = clienteId,
                    IsActive = true,
                    InsDate = DateTime.UtcNow,
                    ModDate = DateTime.UtcNow
                });
            }
        }

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

    [HttpGet("export/pdf")]
    public async Task<IActionResult> ExportPdf(
        [FromQuery] int? cliente_id,
        [FromQuery] int? utente_id,
        [FromQuery] string? filter,
        [FromQuery] string? date_start,
        [FromQuery] string? date_end)
    {
        // Use same query pattern as GetScadenze
        var query = _context.Scadenze.AsQueryable();

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

        // Parse date filters
        DateTime? filterDateStart = null;
        DateTime? filterDateEnd = null;
        if (!string.IsNullOrEmpty(date_start) && DateTime.TryParse(date_start, out var parsedStart))
        {
            filterDateStart = parsedStart.Date;
        }
        if (!string.IsNullOrEmpty(date_end) && DateTime.TryParse(date_end, out var parsedEnd))
        {
            filterDateEnd = parsedEnd.Date;
        }

        // Fetch with projections (same as GetScadenze)
        var scadenzeRaw = await query
            .Select(s => new {
                s.Name,
                s.Date,
                s.Rec,
                Utenti = s.ScadenzeUtenti.Select(su => su.Utente.Cognome).Distinct().ToList(),
                Clienti = s.ScadenzeClienti.Select(sc => sc.Cliente.Name).Distinct().ToList()
            })
            .ToListAsync();

        // Calculate real date and filter (same logic as GetScadenze)
        var today = DateTime.UtcNow.Date;
        var pdfItems = scadenzeRaw
            .Select(s => {
                DateTime? scadenzaReale = s.Date;
                if (s.Date.HasValue && s.Rec > 0)
                {
                    var calcDate = s.Date.Value;
                    while (calcDate.Date < today)
                    {
                        calcDate = calcDate.AddMonths(s.Rec);
                    }
                    scadenzaReale = calcDate;
                }
                return new {
                    s.Name,
                    ScadenzaReale = scadenzaReale,
                    Utenti = string.Join(", ", s.Utenti),
                    Clienti = string.Join(", ", s.Clienti)
                };
            })
            .Where(s => {
                if (!s.ScadenzaReale.HasValue) return false;
                var realDate = s.ScadenzaReale.Value.Date;
                if (filterDateStart.HasValue && realDate < filterDateStart.Value) return false;
                if (filterDateEnd.HasValue && realDate > filterDateEnd.Value) return false;
                return true;
            })
            .OrderBy(s => s.ScadenzaReale)
            .Select((s, i) => new ScadenzaPdfItem
            {
                Index = i + 1,
                Name = s.Name,
                Clienti = s.Clienti,
                Utenti = s.Utenti,
                ScadenzaReale = s.ScadenzaReale!.Value
            })
            .ToList();

        // Format date strings for header
        var dateStartStr = filterDateStart?.ToString("dd/MM/yyyy") ?? "--";
        var dateEndStr = filterDateEnd?.ToString("dd/MM/yyyy") ?? "--";

        // Generate PDF
        var pdfService = new PdfExportService();
        var pdfBytes = pdfService.GenerateScadenzePdf(pdfItems, dateStartStr, dateEndStr);

        return File(pdfBytes, "application/pdf", $"scadenze_{DateTime.Now:yyyyMMdd}.pdf");
    }
}