using System;
using System.Globalization;
using System.Linq;
using LinqToExcel;
using Model;

public partial class Data : PageApi
{
    protected void Page_Load(object sender,
                             EventArgs e)
    {
        var book = new ExcelQueryFactory(@"c:\data\data.xlsx");

        var ARCHIVIO = book.Worksheet("ARCHIVIO")
            .Select(
                row => new
                {
                    row,
                    item = new
                    {
                        DATA = row["DATA"]
                                          .Cast<DateTime>(),
                        DESCRIZIONE = row["DESCRIZIONE"]
                                          .Cast<string>(),
                        CLIENTI = row["CLIENTI"]
                                          .Cast<string>(),
                        UTENTI = row["UTENTI"]
                                          .Cast<string>(),
                        RICORRENZA = row["RICORRENZA"]
                                          .Cast<string>()
                    }
                })
            .Select(t => t.item);

        var UTENTI = book.Worksheet("UTENTI")
            .Select(
                row => new
                {
                    row,
                    item = new
                    {
                        MAIL = row["MAIL"]
                                          .Cast<string>(),
                        NOME = row["NOME"]
                                          .Cast<string>(),
                        COGNOME = row["COGNOME"]
                                          .Cast<string>()
                    }
                })
            .Select(t => t.item);

        var CLIENTI = book.Worksheet("CLIENTI")
            .Select(
                row => new
                {
                    row,
                    item = new
                    {
                        NAME = row["RAGIONE SOCIALE"]
                                          .Cast<string>()
                    }
                })
            .Select(t => t.item);

        var index = 0;
        foreach (var item in ARCHIVIO)
        {
            index++;

            //if (item.DESCRIZIONE != null && item.DESCRIZIONE.ToUpper().Equals("INVIO SPESE MEDICHE ENTRO 31.01"))
            //{
            //    var ok = true;
            //}
            //else
            //{
            //    continue;
            //}

            if (string.IsNullOrEmpty(item.DESCRIZIONE))
                continue;

            if (index >= 100)
            {
                //break;
            }

            try
            {
                Execute(
                       DbAutoSave(
                           new SCADENZE
                           {
                               NAME = item.DESCRIZIONE.Trim(),
                               DATE = DateTime.ParseExact(item.DATA.ToString("dd/MM/yyyy"), "dd/MM/yyyy", CultureInfo.InvariantCulture),
                               REC = item.RICORRENZA.ToInt()
                           }));
            }
            catch (Exception)
            {

            }

            var db_scadenza = Dynamic<SCADENZE>(
                    new Orm()
                        .Select("TOP 1 *")
                        .From(nameof(SCADENZE))
                        .OrderBy("ID DESC")
                        .Build())
                .SingleOrDefault();

            var clienti = item.CLIENTI;

            if (clienti != null)
            {
                foreach (var cliente in clienti.Split(','))
                {
                    foreach (var ut in CLIENTI)
                    {
                        if (cliente != null && ut.NAME?.ToUpper().Trim() == cliente.ToUpper().Trim())
                        {
                            try
                            {
                                Execute(
                                    query: DbAutoSave(
                                        new CLIENTI
                                        {
                                            NAME = ut.NAME.Trim(),
                                        }));
                            }
                            catch (Exception ex)
                            {
                            }

                            try
                            {
                                var db_cliente = Dynamic<CLIENTI>(
                                                           new Orm()
                                                               .Select()
                                                               .From(nameof(CLIENTI))
                                                               .Where("[NAME] = " + SqlString(ut.NAME.ToUpper()))
                                                               .Build())
                                                       .SingleOrDefault();

                                Execute(
                                    query: DbAutoSave(
                                        new SCADENZE_CLIENTI()
                                        {
                                            SCADENZA_ID = db_scadenza.ID,
                                            CLIENTE_ID = db_cliente.ID
                                        }));
                            }
                            catch (Exception ex)
                            {
                            }

                            break;
                        }
                    }
                }
            }

            var utenti = item.UTENTI;

            if (utenti != null)
            {
                foreach (var utente in utenti.Split(','))
                {
                    foreach (var ut in UTENTI)
                    {
                        if (ut.MAIL.ToUpper().Trim() == utente.ToUpper().Trim())
                        {
                            try
                            {
                                Execute(
                                    query: DbAutoSave(
                                        new UTENTI
                                        {
                                            EMAIL = utente.Trim(),
                                            NOME = ut.NOME.Trim(),
                                            COGNOME = ut.COGNOME.Trim()
                                        }));
                            }
                            catch (Exception) { }

                            var db_utente = Dynamic<UTENTI>(
                                    new Orm()
                                        .Select()
                                        .From(nameof(UTENTI))
                                        .Where("[EMAIL] = " + SqlString(ut.MAIL.ToUpper()))
                                        .Build())
                                .SingleOrDefault();

                            try
                            {
                                Execute(
                                    query: DbAutoSave(
                                        new SCADENZE_UTENTI
                                        {
                                            SCADENZA_ID = db_scadenza.ID,
                                            UTENTE_ID = db_utente.ID
                                        }
                                    ));
                            }
                            catch (Exception)
                            {

                            }

                            break;
                        }
                    }
                }
            }
        }
    }
}