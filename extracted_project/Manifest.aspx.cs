using System;
using System.IO;
using System.Web;
using System.Web.UI;

public partial class Manifest : Page
{
    public static string manifest => HttpContext.Current.Request.Params[name: "manifest"];

    protected override void OnInit(
        EventArgs e)
    {
        base.OnInit(e);
        this.ContentType         = "text/cache-manifest";
        this.Response.StatusCode = 200;
    }

    protected override void Render(
        HtmlTextWriter writer)
    {
        var text = File.ReadAllText(HttpContext.Current.Server.MapPath(manifest));
        writer.Write(text);
    }
}