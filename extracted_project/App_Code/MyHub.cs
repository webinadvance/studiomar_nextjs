using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Model;
using Exception = System.Exception;

public class MyHub : Hub
{

    public void serverANVIZACCESS(string id)
    {
        PageApi.Execute(
            PageApi.DbAutoSave(
                new ANVIZ_ACCESS
                {
                    PEOPLE_id = id.ToInt(),
                    INS_DATE  = DateTime.Now,
                    MOD_DATE  = DateTime.Now,
                    IS_ACTIVE = true,
                    TIME      = DateTime.Now
                }));

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" ID,PROFILE_PIC,FIRSTNAME,LASTNAME FROM PEOPLE ");
        builder.Append(" WHERE ID = " + id);

        this.Clients.All.clientACCESS(PageApi.Json(builder));
    }

    public void serverBOOK()
    {
        this.Clients.All.clientBOOK();
    }
}