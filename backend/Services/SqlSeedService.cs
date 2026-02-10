using System.Text.RegularExpressions;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class SqlSeedService
{
    private readonly AppDbContext _context;

    public SqlSeedService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedFromSqlAsync(string sqlFilePath)
    {
        if (!File.Exists(sqlFilePath))
        {
            Console.WriteLine($"SQL file not found: {sqlFilePath}");
            return;
        }

        Console.WriteLine($"Loading SQL seed data from: {sqlFilePath}");
        var sqlContent = await File.ReadAllTextAsync(sqlFilePath);

        try
        {
            // Seed in order: Utenti, Clienti, Scadenze, then junction tables
            await SeedUtentiAsync(sqlContent);
            await SeedClientiAsync(sqlContent);
            await SeedScadenzeAsync(sqlContent);
            await SeedScadenzeClientiAsync(sqlContent);
            await SeedScadenzeUtentiAsync(sqlContent);
            Console.WriteLine("SQL seed completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during SQL seed: {ex.Message}");
            throw;
        }
    }

    private async Task SeedUtentiAsync(string sqlContent)
    {
        if (await _context.Utenti.AnyAsync())
        {
            Console.WriteLine("Utenti table already has data, skipping...");
            return;
        }

        var pattern = @"INSERT \[dbo\]\.\[UTENTI\].*?VALUES \((\d+), N'([^']*)', N'([^']*)', N'([^']*)', CAST\(N'([^']+)'.*?, CAST\(N'([^']+)'.*?, (NULL|\d+), (\d)\)";
        var matches = Regex.Matches(sqlContent, pattern);

        Console.WriteLine($"Found {matches.Count} Utenti records to seed");

        foreach (Match match in matches)
        {
            try
            {
                var id = int.Parse(match.Groups[1].Value);
                var email = match.Groups[2].Value;
                var nome = match.Groups[3].Value;
                var cognome = match.Groups[4].Value;
                var modDate = ParseDateTime(match.Groups[5].Value);
                var insDate = ParseDateTime(match.Groups[6].Value);
                var insUserIdStr = match.Groups[7].Value;
                var isActive = match.Groups[8].Value == "1";

                if (insUserIdStr == "NULL")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""Utenti"" (""Id"", ""Email"", ""Nome"", ""Cognome"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, NULL, {6})",
                        id, email, nome, cognome, modDate, insDate, isActive);
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""Utenti"" (""Id"", ""Email"", ""Nome"", ""Cognome"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7})",
                        id, email, nome, cognome, modDate, insDate, int.Parse(insUserIdStr), isActive);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting Utente: {ex.Message}");
            }
        }

        // Reset sequence to max ID
        await ResetSequence("Utenti");
        Console.WriteLine($"Seeded {matches.Count} Utenti");
    }

    private async Task SeedClientiAsync(string sqlContent)
    {
        if (await _context.Clienti.AnyAsync())
        {
            Console.WriteLine("Clienti table already has data, skipping...");
            return;
        }

        // Pattern handles escaped quotes '' in names
        var pattern = @"INSERT \[dbo\]\.\[CLIENTI\].*?VALUES \((\d+), N'((?:[^']|'')*)', CAST\(N'([^']+)'.*?, CAST\(N'([^']+)'.*?, (NULL|\d+), (\d)\)";
        var matches = Regex.Matches(sqlContent, pattern);

        Console.WriteLine($"Found {matches.Count} Clienti records to seed");

        foreach (Match match in matches)
        {
            try
            {
                var id = int.Parse(match.Groups[1].Value);
                var name = match.Groups[2].Value.Replace("''", "'");
                var modDate = ParseDateTime(match.Groups[3].Value);
                var insDate = ParseDateTime(match.Groups[4].Value);
                var insUserIdStr = match.Groups[5].Value;
                var isActive = match.Groups[6].Value == "1";

                if (insUserIdStr == "NULL")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""Clienti"" (""Id"", ""Name"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, NULL, {4})",
                        id, name, modDate, insDate, isActive);
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""Clienti"" (""Id"", ""Name"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5})",
                        id, name, modDate, insDate, int.Parse(insUserIdStr), isActive);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting Cliente: {ex.Message}");
            }
        }

        await ResetSequence("Clienti");
        Console.WriteLine($"Seeded {matches.Count} Clienti");
    }

    private async Task SeedScadenzeAsync(string sqlContent)
    {
        if (await _context.Scadenze.AnyAsync())
        {
            Console.WriteLine("Scadenze table already has data, skipping...");
            return;
        }

        // Pattern handles escaped quotes '' in names
        var pattern = @"INSERT \[dbo\]\.\[SCADENZE\] \(\[ID\].*?VALUES \((\d+), N'((?:[^']|'')*)', (\d+), CAST\(N'([^']+)'.*?, CAST\(N'([^']+)'.*?, CAST\(N'([^']+)'.*?, (NULL|\d+), (\d)\)";
        var matches = Regex.Matches(sqlContent, pattern);

        Console.WriteLine($"Found {matches.Count} Scadenze records to seed");

        foreach (Match match in matches)
        {
            try
            {
                var id = int.Parse(match.Groups[1].Value);
                var name = match.Groups[2].Value.Replace("''", "'");
                var rec = int.Parse(match.Groups[3].Value);
                var date = ParseDateTime(match.Groups[4].Value);
                var modDate = ParseDateTime(match.Groups[5].Value);
                var insDate = ParseDateTime(match.Groups[6].Value);
                var insUserIdStr = match.Groups[7].Value;
                var isActive = match.Groups[8].Value == "1";

                if (insUserIdStr == "NULL")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""Scadenze"" (""Id"", ""Name"", ""Rec"", ""Date"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, NULL, {6})",
                        id, name, rec, date, modDate, insDate, isActive);
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""Scadenze"" (""Id"", ""Name"", ""Rec"", ""Date"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7})",
                        id, name, rec, date, modDate, insDate, int.Parse(insUserIdStr), isActive);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting Scadenza: {ex.Message}");
            }
        }

        await ResetSequence("Scadenze");
        Console.WriteLine($"Seeded {matches.Count} Scadenze");
    }

    private async Task SeedScadenzeClientiAsync(string sqlContent)
    {
        if (await _context.ScadenzeClienti.AnyAsync())
        {
            Console.WriteLine("ScadenzeClienti table already has data, skipping...");
            return;
        }

        var pattern = @"INSERT \[dbo\]\.\[SCADENZE_CLIENTI\].*?VALUES \((\d+), (\d+), (\d+), CAST\(N'([^']+)'.*?, CAST\(N'([^']+)'.*?, (NULL|\d+), (\d)\)";
        var matches = Regex.Matches(sqlContent, pattern);

        Console.WriteLine($"Found {matches.Count} ScadenzeClienti records to seed");

        foreach (Match match in matches)
        {
            try
            {
                var id = int.Parse(match.Groups[1].Value);
                var scadenzaId = int.Parse(match.Groups[2].Value);
                var clienteId = int.Parse(match.Groups[3].Value);
                var modDate = ParseDateTime(match.Groups[4].Value);
                var insDate = ParseDateTime(match.Groups[5].Value);
                var insUserIdStr = match.Groups[6].Value;
                var isActive = match.Groups[7].Value == "1";

                if (insUserIdStr == "NULL")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""ScadenzeClienti"" (""Id"", ""ScadenzaId"", ""ClienteId"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, NULL, {5})",
                        id, scadenzaId, clienteId, modDate, insDate, isActive);
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""ScadenzeClienti"" (""Id"", ""ScadenzaId"", ""ClienteId"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})",
                        id, scadenzaId, clienteId, modDate, insDate, int.Parse(insUserIdStr), isActive);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting ScadenzeClienti: {ex.Message}");
            }
        }

        await ResetSequence("ScadenzeClienti");
        Console.WriteLine($"Seeded {matches.Count} ScadenzeClienti");
    }

    private async Task SeedScadenzeUtentiAsync(string sqlContent)
    {
        if (await _context.ScadenzeUtenti.AnyAsync())
        {
            Console.WriteLine("ScadenzeUtenti table already has data, skipping...");
            return;
        }

        var pattern = @"INSERT \[dbo\]\.\[SCADENZE_UTENTI\].*?VALUES \((\d+), (\d+), (\d+), CAST\(N'([^']+)'.*?, CAST\(N'([^']+)'.*?, (NULL|\d+), (\d)\)";
        var matches = Regex.Matches(sqlContent, pattern);

        Console.WriteLine($"Found {matches.Count} ScadenzeUtenti records to seed");

        foreach (Match match in matches)
        {
            try
            {
                var id = int.Parse(match.Groups[1].Value);
                var scadenzaId = int.Parse(match.Groups[2].Value);
                var utenteId = int.Parse(match.Groups[3].Value);
                var modDate = ParseDateTime(match.Groups[4].Value);
                var insDate = ParseDateTime(match.Groups[5].Value);
                var insUserIdStr = match.Groups[6].Value;
                var isActive = match.Groups[7].Value == "1";

                if (insUserIdStr == "NULL")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""ScadenzeUtenti"" (""Id"", ""ScadenzaId"", ""UtenteId"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, NULL, {5})",
                        id, scadenzaId, utenteId, modDate, insDate, isActive);
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        @"INSERT INTO ""ScadenzeUtenti"" (""Id"", ""ScadenzaId"", ""UtenteId"", ""ModDate"", ""InsDate"", ""InsUserId"", ""IsActive"")
                          OVERRIDING SYSTEM VALUE
                          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})",
                        id, scadenzaId, utenteId, modDate, insDate, int.Parse(insUserIdStr), isActive);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting ScadenzeUtenti: {ex.Message}");
            }
        }

        await ResetSequence("ScadenzeUtenti");
        Console.WriteLine($"Seeded {matches.Count} ScadenzeUtenti");
    }

    private async Task ResetSequence(string tableName)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                $@"SELECT setval(pg_get_serial_sequence('""{tableName}""', 'Id'), COALESCE((SELECT MAX(""Id"") FROM ""{tableName}""), 1))");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Could not reset sequence for {tableName}: {ex.Message}");
        }
    }

    private static DateTime? ParseDateTime(string value)
    {
        if (string.IsNullOrEmpty(value)) return null;
        // Format: 2018-12-11T16:10:15.2170000
        if (DateTime.TryParse(value, out var result))
            return DateTime.SpecifyKind(result, DateTimeKind.Utc);
        return null;
    }
}
