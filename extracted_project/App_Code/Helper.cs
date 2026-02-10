using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using Model.Enums;
using Newtonsoft.Json;

public static class Helper
{
    public static IEnumerable<TSource> DistinctBy<TSource, TKey>
        (this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
    {
        HashSet<TKey> seenKeys = new HashSet<TKey>();
        foreach (TSource element in source)
        {
            if (seenKeys.Add(keySelector(element)))
            {
                yield return element;
            }
        }
    }

    public static DateTime GetDateFromWeekNumberAndDayOfWeek(int weekNumber,
                                               int dayOfWeek)
    {
        var jan1 = new DateTime(
            DateTime.Now.Year,
            1,
            1);
        var daysOffset = DayOfWeek.Tuesday - jan1.DayOfWeek;

        var firstMonday = jan1.AddDays(daysOffset);

        var cal = new CultureInfo("it-IT").Calendar;
        var firstWeek = cal.GetWeekOfYear(
            jan1,
            CalendarWeekRule.FirstFourDayWeek,
            DayOfWeek.Monday);

        var weekNum = weekNumber;
        if (firstWeek <= 1)
        {
            weekNum -= 1;
        }

        var result = firstMonday.AddDays(((weekNum * 7) + dayOfWeek) - 1);
        return result;
    }


    public static int ToIso8601WeekOfYear(this DateTime time)
    {
        var day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
        if ((day >= DayOfWeek.Monday) && (day <= DayOfWeek.Wednesday))
        {
            time = time.AddDays(3);
        }

        return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
            time,
            CalendarWeekRule.FirstFourDayWeek,
            DayOfWeek.Monday);
    }

    public static object Deserialize(this string o)
    {
        return JsonConvert.DeserializeObject(
            o,
            new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                Formatting        = Formatting.None
            });
    }

    public static T Deserialize<T>(this string o)
        where T : class
    {
        if (string.IsNullOrEmpty(o))
        {
            return null;
        }

        return JsonConvert.DeserializeObject<T>(
            o,
            new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                Formatting        = Formatting.None
            });
    }

    public static string FirstCharToUpper(this string input)
    {
        switch (input)
        {
            case null: throw new ArgumentNullException(nameof(input));
            case "":
                throw new ArgumentException(
                    $"{nameof(input)} cannot be empty",
                    nameof(input));
            default:
                return input.First()
                           .ToString()
                           .ToUpper()
                       + input.Substring(1);
        }
    }

    public static bool IsNull(this string o)
    {
        return string.IsNullOrEmpty(o);
    }

    public static IEnumerable<T> Select<T>(this DbDataReader     reader,
                                           Func<DbDataReader, T> selector)
    {
        while (reader.Read())
        {
            yield return selector(reader);
        }
    }

    public static string Serialize(this object o)
    {
        return JsonConvert.SerializeObject(
            o,
            new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                Formatting        = Formatting.None
            });
    }

    public static string String(this object o)
    {
        return o?.ToString();
    }

    public static DayOfWeek ToDayOfWeek(this EWEEKDAY eweekday)
    {
        return (DayOfWeek)Enum.Parse(
            typeof(DayOfWeek),
            eweekday.ToString()
                .ToLower()
                .FirstCharToUpper());
    }

    public static int ToInt(this object o)
    {
        return o == null || o == DBNull.Value
                   ? 0
                   : Convert.ToInt32(o);
    }

    public static T ToEnum<T>(this object o)
    {
        return (T)Enum.Parse(typeof(T), o.String());
    }

    public static string ToJson(this SqlDataReader rdr)
    {
        var sb = new StringBuilder();
        var sw = new StringWriter(sb);

        using (JsonWriter jsonWriter = new JsonTextWriter(sw))
        {
            jsonWriter.WriteStartArray();

            while (rdr.Read())
            {
                jsonWriter.WriteStartObject();

                var fields = rdr.FieldCount;

                for (var i = 0;
                     i < fields;
                     i++)
                {
                    if (!string.IsNullOrEmpty(
                            rdr[i]
                                .ToString()))
                    {
                        jsonWriter.WritePropertyName(rdr.GetName(i));
                        jsonWriter.WriteValue(rdr[i]);
                    }
                }

                jsonWriter.WriteEndObject();
            }

            jsonWriter.WriteEndArray();

            return sw.ToString();
        }
    }
}