using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using System.Globalization;

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
                ScadenzeUtenti = s.ScadenzeUtenti.Select(su => new { su.Id, su.UtenteId, su.ScadenzaId, su.Utente.Nome, su.Utente.Cognome }),
                ScadenzeClienti = s.ScadenzeClienti.Select(sc => new { sc.Id, sc.ClienteId, sc.ScadenzaId, sc.Cliente.Name })
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
                return new {
                    s.Id,
                    s.Name,
                    s.Date,
                    ScadenzaReale = scadenzaReale,
                    s.Rec,
                    s.InsDate,
                    s.ModDate,
                    s.InsUserId,
                    s.IsActive,
                    s.ScadenzeUtenti,
                    s.ScadenzeClienti
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

    [HttpGet("export/pdf")]
    public async Task<IActionResult> ExportPdf(
        [FromQuery] int? cliente_id,
        [FromQuery] int? utente_id,
        [FromQuery] string? filter,
        [FromQuery] string? date_start,
        [FromQuery] string? date_end)
    {
        // Get all scadenze with related data
        var query = _context.Scadenze
            .Include(s => s.ScadenzeUtenti).ThenInclude(su => su.Utente)
            .Include(s => s.ScadenzeClienti).ThenInclude(sc => sc.Cliente)
            .AsQueryable();

        // Apply cliente filter
        if (cliente_id.HasValue)
        {
            query = query.Where(s => s.ScadenzeClienti.Any(sc => sc.ClienteId == cliente_id.Value));
        }

        // Apply utente filter
        if (utente_id.HasValue)
        {
            query = query.Where(s => s.ScadenzeUtenti.Any(su => su.UtenteId == utente_id.Value));
        }

        // Apply name filter
        if (!string.IsNullOrEmpty(filter))
        {
            query = query.Where(s => s.Name.Contains(filter));
        }

        var scadenze = await query.ToListAsync();

        // Parse date filters
        DateTime? filterDateStart = null;
        DateTime? filterDateEnd = null;

        if (!string.IsNullOrEmpty(date_start) && DateTime.TryParse(date_start, out var parsedStart))
        {
            filterDateStart = parsedStart;
        }
        if (!string.IsNullOrEmpty(date_end) && DateTime.TryParse(date_end, out var parsedEnd))
        {
            filterDateEnd = parsedEnd;
        }

        // Calculate RO_SCADENZA_REALE (real due date with recurrence) and filter
        var pdfItems = new List<ScadenzaPdfItem>();
        var today = DateTime.UtcNow.Date;

        foreach (var scadenza in scadenze)
        {
            if (!scadenza.Date.HasValue) continue;

            // Calculate real due date with recurrence
            var scadenzaReale = scadenza.Date.Value;

            if (scadenza.Rec > 0)
            {
                // Keep adding REC months until the date is >= today
                while (scadenzaReale.Date < today)
                {
                    scadenzaReale = scadenzaReale.AddMonths(scadenza.Rec);
                }
            }

            // Filter by date range on the calculated real date
            if (filterDateStart.HasValue && scadenzaReale.Date < filterDateStart.Value.Date)
            {
                continue;
            }
            if (filterDateEnd.HasValue && scadenzaReale.Date > filterDateEnd.Value.Date)
            {
                continue;
            }

            // Build clienti string (comma-separated names)
            var clientiNames = scadenza.ScadenzeClienti
                .Where(sc => sc.Cliente != null)
                .Select(sc => sc.Cliente!.Name)
                .Distinct()
                .ToList();

            // Build utenti string (comma-separated cognome)
            var utentiNames = scadenza.ScadenzeUtenti
                .Where(su => su.Utente != null)
                .Select(su => su.Utente!.Cognome)
                .Distinct()
                .ToList();

            pdfItems.Add(new ScadenzaPdfItem
            {
                Name = scadenza.Name,
                Clienti = string.Join(", ", clientiNames),
                Utenti = string.Join(", ", utentiNames),
                ScadenzaReale = scadenzaReale
            });
        }

        // Sort by real due date and assign index
        pdfItems = pdfItems.OrderBy(x => x.ScadenzaReale).ToList();
        for (int i = 0; i < pdfItems.Count; i++)
        {
            pdfItems[i].Index = i + 1;
        }

        // Format date strings for header
        var dateStartStr = filterDateStart?.ToString("dd/MM/yyyy") ?? "--";
        var dateEndStr = filterDateEnd?.ToString("dd/MM/yyyy") ?? "--";

        // Generate PDF
        var pdfService = new PdfExportService();
        var pdfBytes = pdfService.GenerateScadenzePdf(pdfItems, dateStartStr, dateEndStr);

        return File(pdfBytes, "application/pdf", $"scadenze_{DateTime.Now:yyyyMMdd}.pdf");
    }
}