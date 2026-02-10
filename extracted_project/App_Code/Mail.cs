using System.Net.Mail;

public static class Mail
{
    public static string ReplaceAll(this   string   s,
                                    params object[] objs)
    {
        foreach (var o in objs)
        {
            foreach (var property_info in o.GetType()
                .GetProperties())
            {
                s = s.Replace(
                    "[["
                    + o.GetType()
                        .Name.ToUpper()
                    + "."
                    + property_info.Name.ToUpper()
                    + "]]", property_info.GetValue(o, null)
                        ?.ToString());
            }
        }

        return s;
    }

    public static void SendMail(string to,
                                string body,
                                string subject)
    {
        var mail   = new MailMessage(new MailAddress("noreply@myownsmtp.cloud", "KYMERA.cloud"), new MailAddress(to.ToLower(), to.ToLower()));
        var client = new SmtpClient();
        mail.Subject    = subject;
        mail.IsBodyHtml = true;
        mail.Body       = body;
        client.Send(mail);
    }
}