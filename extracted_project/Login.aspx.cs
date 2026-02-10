using System;
using System.Text;
using System.Web;
using System.Web.UI;
using Model;

public partial class Login : Page
{
    private string GUID => this.Request.QueryString["g"];

    private string REFERRER => this.Request.QueryString["r"];

    protected override void OnLoad(
        EventArgs e)
    {
        base.OnLoad(e: e);

        var authHeader = this.Request.Headers["Authorization"];

        var currentUserCookie = HttpContext.Current.Request.Cookies["token_12"];
        HttpContext.Current.Response.Cookies.Remove("token_12");
        if (currentUserCookie != null)
        {
            currentUserCookie.Expires = DateTime.Now.AddDays(-10);
            currentUserCookie.Value   = null;
            HttpContext.Current.Response.SetCookie(currentUserCookie);
        }

        if (!string.IsNullOrEmpty(this.GUID))
        {
            var people = new PageApi().DbLogin(this.GUID);

            if (people?.ID > 0)
            {
                this.SetCookie(people.GUID, people);
                this.Response.Redirect("~/me");
            }
        }

        if ((authHeader != null) && authHeader.StartsWith("Basic"))
        {
            authHeader = authHeader.Substring(startIndex: "Basic".Length)
                .Trim();
            var authHeaderBytes = Convert.FromBase64String(s: authHeader);
            authHeader = Encoding.UTF8.GetString(bytes: authHeaderBytes);

            var userName = authHeader.Split(':')[0];
            var password = authHeader.Split(':')[1];

            var res = new PageApi().DbLogin(userName, password);

            var guid = res?.GUID;

            this.SetCookie(guid, res);
        }

        this.Response.StatusCode = 401;
        this.Response.AppendHeader(
            "WWW-Authenticate",
            "Basic");
    }

    private void SetCookie(string guid,
                           PEOPLE res)
    {
        if (!string.IsNullOrEmpty(guid))
        {
            this.Request.Cookies.Add(
                new HttpCookie("token_12")
                {
                    Value   = guid,
                    Expires = DateTime.Now.AddMonths(1)
                });
            this.Response.Cookies.Add(
                new HttpCookie("token_12")
                {
                    Value   = guid,
                    Expires = DateTime.Now.AddMonths(1)
                });

            if (res != null)
            {
                this.Response.Redirect("~/me");
            }
        }
    }
}