using System;
using System.Web;
using System.Web.UI;

public partial class ClearCredentials : Page
{
    protected override void OnLoad(
        EventArgs e)
    {
        base.OnLoad(e: e);

        HttpCookie currentUserCookie = HttpContext.Current.Request.Cookies["token_12"];
        HttpContext.Current.Response.Cookies.Remove("token_12");

        if (currentUserCookie != null)
        {
            currentUserCookie.Expires = DateTime.Now.AddDays(-10);
            currentUserCookie.Value   = null;
            HttpContext.Current.Response.SetCookie(currentUserCookie);
        }

        this.Response.StatusCode = 401;
    }
}