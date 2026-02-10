using OfficeOpenXml;
using Backend.Data;
using Backend.Models;
using System.Globalization;

namespace Backend.Services;

public class DataImportService
{
    private readonly AppDbContext _context;

    public DataImportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task ImportDataAsync()
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        using var package = new ExcelPackage(new FileInfo(@"/app/data/data.xlsx"));

        var archivioSheet = package.Workbook.Worksheets["ARCHIVIO"];
        var utentiSheet = package.Workbook.Worksheets["UTENTI"];
        var clientiSheet = package.Workbook.Worksheets["CLIENTI"];

        var archivio = archivioSheet.Cells["A2:D"]
            .Select(cell => new
            {
                Data = archivioSheet.Cells[cell.Start.Row, 1].GetValue<DateTime>(),
                Descrizione = archivioSheet.Cells[cell.Start.Row, 2].GetValue<string>(),
                Clienti = archivioSheet.Cells[cell.Start.Row, 3].GetValue<string>(),
                Utenti = archivioSheet.Cells[cell.Start.Row, 4].GetValue<string>(),
                Ricorrenza = archivioSheet.Cells[cell.Start.Row, 5].GetValue<string>()
            })
            .Where(row => !string.IsNullOrEmpty(row.Descrizione))
            .ToList();

        var utenti = utentiSheet.Cells["A2:C"]
            .Select(cell => new
            {
                Mail = utentiSheet.Cells[cell.Start.Row, 1].GetValue<string>(),
                Nome = utentiSheet.Cells[cell.Start.Row, 2].GetValue<string>(),
                Cognome = utentiSheet.Cells[cell.Start.Row, 3].GetValue<string>()
            })
            .ToList();

        var clienti = clientiSheet.Cells["A2:A"]
            .Select(cell => new
            {
                Name = clientiSheet.Cells[cell.Start.Row, 1].GetValue<string>()
            })
            .ToList();

        var index = 0;
        foreach (var item in archivio)
        {
            index++;
            if (index >= 100) break;

            try
            {
                var scadenza = new Scadenze
                {
                    Name = item.Descrizione.Trim(),
                    Date = DateTime.ParseExact(item.Data.ToString("dd/MM/yyyy"), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                    Rec = int.TryParse(item.Ricorrenza, out var rec) ? rec : 0,
                    InsDate = DateTime.Now,
                    IsActive = true
                };

                _context.Scadenze.Add(scadenza);
                await _context.SaveChangesAsync();

                var dbScadenza = _context.Scadenze.OrderByDescending(s => s.Id).First();

                // Handle clienti
                if (!string.IsNullOrEmpty(item.Clienti))
                {
                    foreach (var cliente in item.Clienti.Split(','))
                    {
                        var matchingCliente = clienti.FirstOrDefault(c => c.Name?.ToUpper().Trim() == cliente.ToUpper().Trim());
                        if (matchingCliente != null)
                        {
                            var dbCliente = _context.Clienti.FirstOrDefault(c => c.Name.ToUpper() == matchingCliente.Name.ToUpper());
                            if (dbCliente == null)
                            {
                                dbCliente = new Clienti
                                {
                                    Name = matchingCliente.Name.Trim(),
                                    InsDate = DateTime.Now,
                                    IsActive = true
                                };
                                _context.Clienti.Add(dbCliente);
                                await _context.SaveChangesAsync();
                            }

                            var scadenzaCliente = new ScadenzeClienti
                            {
                                ScadenzaId = dbScadenza.Id,
                                ClienteId = dbCliente.Id,
                                InsDate = DateTime.Now,
                                IsActive = true
                            };
                            _context.ScadenzeClienti.Add(scadenzaCliente);
                        }
                    }
                }

                // Handle utenti
                if (!string.IsNullOrEmpty(item.Utenti))
                {
                    foreach (var utente in item.Utenti.Split(','))
                    {
                        var matchingUtente = utenti.FirstOrDefault(u => u.Mail.ToUpper().Trim() == utente.ToUpper().Trim());
                        if (matchingUtente != null)
                        {
                            var dbUtente = _context.Utenti.FirstOrDefault(u => u.Email.ToUpper() == matchingUtente.Mail.ToUpper());
                            if (dbUtente == null)
                            {
                                dbUtente = new Utenti
                                {
                                    Email = utente.Trim(),
                                    Nome = matchingUtente.Nome.Trim(),
                                    Cognome = matchingUtente.Cognome.Trim(),
                                    InsDate = DateTime.Now,
                                    IsActive = true
                                };
                                _context.Utenti.Add(dbUtente);
                                await _context.SaveChangesAsync();
                            }

                            var scadenzaUtente = new ScadenzeUtenti
                            {
                                ScadenzaId = dbScadenza.Id,
                                UtenteId = dbUtente.Id,
                                InsDate = DateTime.Now,
                                IsActive = true
                            };
                            _context.ScadenzeUtenti.Add(scadenzaUtente);
                        }
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Log or handle error
            }
        }
    }
}