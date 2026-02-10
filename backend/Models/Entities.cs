using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Scadenze
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public int Rec { get; set; }
    public DateTime? Date { get; set; }
    public DateTime? ModDate { get; set; }
    public DateTime? InsDate { get; set; }
    public int? InsUserId { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<ScadenzeUtenti> ScadenzeUtenti { get; set; } = new List<ScadenzeUtenti>();
    public ICollection<ScadenzeClienti> ScadenzeClienti { get; set; } = new List<ScadenzeClienti>();
}

public class Clienti
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
    public DateTime? ModDate { get; set; }
    public DateTime? InsDate { get; set; }
    public int? InsUserId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class Utenti
{
    public int Id { get; set; }
    [Required]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Nome { get; set; } = string.Empty;
    [Required]
    public string Cognome { get; set; } = string.Empty;
    public DateTime? ModDate { get; set; }
    public DateTime? InsDate { get; set; }
    public int? InsUserId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ScadenzeClienti
{
    public int Id { get; set; }
    public int? ScadenzaId { get; set; }
    public int? ClienteId { get; set; }
    public DateTime? ModDate { get; set; }
    public DateTime? InsDate { get; set; }
    public int? InsUserId { get; set; }
    public bool IsActive { get; set; } = true;

    public Scadenze? Scadenza { get; set; }
    public Clienti? Cliente { get; set; }
}

public class ScadenzeUtenti
{
    public int Id { get; set; }
    public int? ScadenzaId { get; set; }
    public int? UtenteId { get; set; }
    public DateTime? ModDate { get; set; }
    public DateTime? InsDate { get; set; }
    public int? InsUserId { get; set; }
    public bool IsActive { get; set; } = true;

    public Scadenze? Scadenza { get; set; }
    public Utenti? Utente { get; set; }
}