using System;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
[assembly: OwinStartup(typeof(Startup))]

public class Startup
{
    public void Configuration(
        IAppBuilder app)
    {
        var hubConfiguration = new HubConfiguration();
        hubConfiguration.EnableDetailedErrors             = false;
        GlobalHost.Configuration.DefaultMessageBufferSize = 500;
        GlobalHost.Configuration.DisconnectTimeout        = TimeSpan.FromSeconds(100);
        app.MapSignalR();
    }
}
