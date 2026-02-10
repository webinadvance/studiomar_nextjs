using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web.UI;
using Model;

public partial class Pdf : Page
{
    public List<SCADENZE> SCADENZE;

    public string CARD_ID => this.Request.QueryString["card_id"];

    public string p_cliente => this.Request.QueryString["p_cliente"];

    public string p_utente => this.Request.QueryString["p_utente"];

    public string p_filter => this.Request.QueryString["p_filter"];

    public string p_date_start => this.Request.QueryString["p_date_start"];

    public string p_date_end => this.Request.QueryString["p_date_end"];

    public string S_DATE_START => !string.IsNullOrEmpty(p_date_start) ? DateTime.ParseExact(p_date_start, "yyyy-MM-dd", CultureInfo.CurrentCulture).ToString("dd/MM/yyyy") : "--";

    public string S_DATE_END => !string.IsNullOrEmpty(p_date_end) ? DateTime.ParseExact(p_date_end, "yyyy-MM-dd", CultureInfo.CurrentCulture).ToString("dd/MM/yyyy") : "--";

    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);

        var builder = new StringBuilder();

        var scadenae = new PageApi().ScadenzeGetAll(p_cliente, p_utente, p_filter, p_date_start, p_date_end);

        builder.Clear();
        builder.Append(
            new Orm()
                .Select("*")
                .From(nameof(SCADENZE))
                .Build());
        this.SCADENZE = scadenae.Deserialize<List<SCADENZE>>();
    }
}