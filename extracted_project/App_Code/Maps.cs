using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json.Linq;

public static class Maps
{
    public static Dictionary<string, string> CACHEDISTANCE = new Dictionary<string, string>();

    private static readonly string APYKEY = "AIzaSyDRCxEQanQnzhwrhUGDYq_hsVs7Pytj8Uo";

    public static string GetDistance(string origins,
                                     string destinations)
    {
        try
        {
            if ((origins == null) || (destinations == null))
            {
                return string.Empty;
            }

            if (CACHEDISTANCE.ContainsKey(origins + destinations))
            {
                return CACHEDISTANCE[origins + destinations];
            }

            using (var client = new WebClient())
            {
                var     s   = client.DownloadString("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + origins + "&destinations=" + destinations + "&key=" + APYKEY);
                dynamic res = JObject.Parse(s);
                string distance = res.rows[0]
                    .elements[0]
                    .distance.text;
                CACHEDISTANCE.Add(origins + destinations, distance);
                return distance;
            }
        }
        catch (Exception e)
        {
            return "N/A";
        }
    }
}