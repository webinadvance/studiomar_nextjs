using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.UI;
using Microsoft.CSharp.RuntimeBinder;
using Model;
using Model.Enums;

public class PageApi : Page
{
    private dynamic _DATA;

    private bool _DATACHECK;

    private string _RAWDATA;

    private string _TOKEN;

    public string DOMAIN => Request.Url.Host.Split('.')[0]== "localhost" ? "studiomar" : Request.Url.Host.Split('.')[0];

    public bool ISLOCALHOST => DOMAIN.ToLower() == "localhost";

    public dynamic DATA
    {
        get
        {
            if (!this._DATACHECK)
            {
                try
                {
                    var res = RAWDATA
                        .Deserialize()
                        ?.ToString()
                        ?.Deserialize<dynamic>();
                    _DATA  = ((string)res?.data?.Value).Deserialize<dynamic>();
                    _TOKEN = (string)res?.token_12?.Value;
                }
                catch (Exception e) { }

                _DATACHECK = true;
            }

            return _DATA;
        }
    }

    public string Method => Page.Request.QueryString["f"];

    public string RAWDATA => _RAWDATA ?? (_RAWDATA = GetData());

    public string TOKEN
    {
        get
        {
            if (!_DATACHECK)
            {
                try
                {
                    var res = RAWDATA
                        .Deserialize()
                        ?.ToString()
                        ?.Deserialize<dynamic>();
                    _DATA  = ((string)res?.data?.Value).Deserialize<dynamic>();
                    _TOKEN = (string)res?.token_12?.Value;
                }
                catch (Exception e) { }

                _DATACHECK = true;
            }

            return _TOKEN;
        }
    }

    public string URLDATA => Request.QueryString["d"];

    private static string CONNECTIONSTRING => ConfigurationManager.ConnectionStrings["default"]
        .ConnectionString;

    public static IEnumerable<T> Dynamic<T>(StringBuilder query)
    {
        var           list       = new List<T>();
        SqlConnection connection = null;
        var dr = DbReader(
            query.ToString(), ref connection);

        var    reflec = new Reflection();
        object instance;
        var    lstObj = new List<object>();
        while (dr.Read())
        {
            instance = Activator.CreateInstance(
                list.GetType()
                    .GetGenericArguments()[0]);
            foreach (DataRow drow in dr.GetSchemaTable()
                .Rows)
            {
                reflec.FillObjectWithProperty(
                    ref instance,
                    drow.ItemArray[0]
                        .ToString(), dr[drow.ItemArray[0]
                        .ToString()]);
            }

            lstObj.Add(instance);
        }

        var lstResult = new List<T>();
        foreach (var item in lstObj)
        {
            lstResult.Add((T)Convert.ChangeType(item, typeof(T)));
        }

        connection.Close();
        connection.Dispose();

        return lstResult;
    }

    public static object Scalar(StringBuilder query)
    {
        SqlConnection connection = null;
        var res = DbReaderScalar(
            query.ToString(), ref connection);

        connection.Close();
        connection.Dispose();

        return res;
    }

    public static string Execute(StringBuilder query)
    {
        SqlConnection connection = null;

        object res = string.Empty;
        try
        {
           res = DbExecute(
                query.ToString(), ref connection);
        }
        catch (Exception e)
        {

            connection.Close();
            connection.Dispose();
            throw e;
        }

        connection.Close();
        connection.Dispose();

        return res.ToString();
    }

    public static string Json(StringBuilder query)
    {
        SqlConnection connection = null;
        var sql_data_reader = DbReader(
            query.ToString(), ref connection);

        var json = sql_data_reader
            .ToJson();

        connection.Close();
        connection.Dispose();

        return json;
    }

    public PEOPLE CheckLogin(params EPROFILE[] permission)
    {
        var db_people = DbLogin(TOKEN);
        if ((permission == null) && (db_people != null))
        {
            return db_people;
            throw new Exception("Devi effettuare l'accesso per poter usare questa funzione");
            Response.Redirect("/Login.aspx");
        }

        if ((permission == null) || (permission.Length == 0))
        {
            return db_people;
        }

        if ((permission != null) && (permission.Length > 0))
        {
            if (permission.Count(x => x.ToString() == db_people?.EPROFILE) == 0)
            {
                throw new Exception("il tuo porfilo non ha abbastanza privilegi");
            }

            return db_people;
        }

        return db_people;
    }

    public static StringBuilder DbAutoSave<T>(T               db_data,
                                              params string[] fields)
        where T : new()
    {
        return DbAutoSave(db_data, false, 0, fields);
    }

    public static StringBuilder DbAutoSave<T>(T               db_data,
                                       int             user_id = 0,
                                       params string[] fields)
        where T : new()
    {
        return DbAutoSave<T>(db_data, false, user_id, fields);
    }

    public static StringBuilder DbAutoSave<T>(T               db_data,
                                       bool            KeepCase = false,
                                       int             user_id  = 0,
                                       params string[] fields)
        where T : new()
    {
        var builder = new StringBuilder();

        var has_MOD_USER_ID = false;

        ((dynamic)db_data).MOD_DATE = DateTime.Now;

        if (user_id > 0)
        {
            try
            {
                ((dynamic)db_data).MOD_USER_ID = user_id;
                has_MOD_USER_ID                = true;
            }
            catch (RuntimeBinderException)
            {
                has_MOD_USER_ID = false;
            }
        }

        if (((dynamic)db_data).ID > 0)
        {
            builder.Append(" UPDATE " + typeof(T).Name + " ");
            builder.Append(" SET ");
            foreach (var property_info in db_data.GetType()
                .GetProperties())
            {
                if (property_info.Name.ToUpper() == "ID")
                {
                    continue;
                }

                if (property_info.Name.ToUpper()
                    .StartsWith("RO_"))
                {
                    continue;
                }

                if (property_info.Name.ToUpper()
                    .Contains("ILIST"))
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "MOD_DATE")
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "MOD_USER_ID")
                {
                    continue;
                }

                if ((fields.Length > 0) && !fields.Contains(property_info.Name.ToUpper()))
                {
                    continue;
                }

                builder.Append("[" + property_info.Name + "] = " + SqlGetData(property_info, db_data, KeepCase) + ", ");
            }

            if (has_MOD_USER_ID)
            {
                builder.Append(" MOD_USER_ID = " + user_id+ ",");
            }

            builder.Append(" MOD_DATE = GETDATE() ");
            builder.Append(" WHERE ID = " + ((dynamic)db_data).ID);
        }
        else
        {
            ((dynamic)db_data).MOD_DATE = DateTime.Now;
            ((dynamic)db_data).INS_DATE = DateTime.Now;

            builder.Append(" INSERT INTO " + typeof(T).Name + " ");
            builder.Append(" ( ");
            foreach (var property_info in db_data.GetType()
                .GetProperties())
            {
                if (property_info.Name.ToUpper() == "ID")
                {
                    continue;
                }

                if (property_info.Name.ToUpper().Contains("ILIST"))
                {
                    continue;
                }

                if (property_info.Name.ToUpper().StartsWith("RO_"))
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "MOD_DATE")
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "MOD_USER_ID")
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "INS_DATE")
                {
                    continue;
                }

                if ((fields.Length > 0) && !fields.Contains(property_info.Name.ToUpper()))
                {
                    continue;
                }

                builder.Append("[" + property_info.Name + "], ");
            }

            if (has_MOD_USER_ID)
            {
                builder.Append(" MOD_USER_ID, ");
            }

            builder.Append(" INS_DATE, ");
            builder.Append(" MOD_DATE ");

            builder.Append(" ) ");
            builder.Append(" VALUES ");
            builder.Append(" ( ");
            foreach (var property_info in db_data.GetType()
                .GetProperties())
            {
                if (property_info.Name.ToUpper() == "ID")
                {
                    continue;
                }

                if ((fields.Length > 0) && !fields.Contains(property_info.Name.ToUpper()))
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "MOD_DATE")
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "MOD_USER_ID")
                {
                    continue;
                }

                if (property_info.Name.ToUpper() == "INS_DATE")
                {
                    continue;
                }

                if (property_info.Name.ToUpper().Contains("ILIST"))
                {
                    continue;
                }

                if (property_info.Name.ToUpper().StartsWith("RO_"))
                {
                    continue;
                }

                builder.Append(SqlGetData(property_info, db_data,KeepCase) + ", ");
            }

            if (has_MOD_USER_ID)
            {
                builder.Append(user_id + ",");
            }

            builder.Append(" GETDATE(), ");
            builder.Append(" GETDATE() ");

            builder.Append(" ) ");
        }

        var res = builder.ToString();

        return builder;
    }

    public PEOPLE DbLogin(string PHONE_NUMBER,
                          string PASSWORD)
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(PEOPLE)                                                                                                + " ");
        builder.Append(" WHERE " + nameof(PEOPLE.PHONE_NUMBER) + " = '" + PHONE_NUMBER + "' AND " + nameof(PEOPLE.PASSWORD) + " = '" + PASSWORD + "'");

        var res = Dynamic<PEOPLE>(builder);
        return res.FirstOrDefault();
    }

    public PEOPLE DbLogin()
    {
        return DbLogin(TOKEN);
    }

    public PEOPLE DbLogin(string GUID)
    {
        if (string.IsNullOrEmpty(GUID))
        {
            return null;
        }

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(PEOPLE)                       + " ");
        builder.Append(" WHERE " + nameof(PEOPLE.GUID) + " = '" + GUID + "'");

        var res = Dynamic<PEOPLE>(builder);
        return res.FirstOrDefault();
    }

    public string GetData()
    {
        var stream = new StreamReader(Request.InputStream);
        var x      = stream.ReadToEnd();
        return x;
    }

    public void WriteLoginCookies(string guid)
    {
        if (!string.IsNullOrEmpty(guid))
        {
            Request.Cookies.Add(
                new HttpCookie("token_12")
                {
                    Value   = guid,
                    Expires = DateTime.Now.AddMonths(1)
                });
            Response.Cookies.Add(
                new HttpCookie("token_12")
                {
                    Value   = guid,
                    Expires = DateTime.Now.AddMonths(1)
                });
        }
    }

    public static string SqlBool(bool? val)
    {
        if (val != null)
        {
            return val == true
                       ? "1"
                       : "0";
        }

        return "NULL";
    }

    //public static string SqlDate(DateTime? val)
    //{
    //    if ((val != null) && (val.Value.Year != DateTime.MinValue.Year))
    //    {
    //        return "CONVERT(datetime, '" + val.Value.ToString("yyyy-MM-dd") + "')";
    //    }

    //    return "NULL";
    //}

    public static string SqlDateTime(DateTime? val)
    {
        if ((val != null) && (val.Value.Year != DateTime.MinValue.Year))
        {
            return "CONVERT(datetime, '" + val.Value.ToString("yyyy-MM-dd HH:mm:ss") + "')";
        }

        return "NULL";
    }

    public static string SqlFloat(float? val)
    {
        if (val == null)
        {
            return "NULL";
        }

        return val.ToString();
    }

    public static string SqlGetData(PropertyInfo property_info,
                             object       db_data, bool KeepCase)
    {
        if (property_info.PropertyType == typeof(string))
        {
            return SqlString((string)property_info.GetValue(db_data, null), KeepCase);
        }

        if (property_info.PropertyType == typeof(DateTime))
        {
            return SqlDateTime((DateTime)property_info.GetValue(db_data, null));
        }

        if (property_info.PropertyType == typeof(DateTime?))
        {
            return SqlDateTime(property_info.GetValue(db_data, null) as DateTime?);
        }

        if (property_info.PropertyType == typeof(bool))
        {
            return SqlBool((bool)property_info.GetValue(db_data, null));
        }

        if (property_info.PropertyType == typeof(bool?))
        {
            return SqlBool(property_info.GetValue(db_data, null) as bool?);
        }

        if (property_info.PropertyType == typeof(float))
        {
            return SqlFloat((float)property_info.GetValue(db_data, null));
        }

        if (property_info.PropertyType == typeof(float?))
        {
            return SqlFloat(property_info.GetValue(db_data, null) as float?);
        }

        if (property_info.PropertyType == typeof(int))
        {
            return SqlInt((int)property_info.GetValue(db_data, null));
        }

        if (property_info.PropertyType == typeof(int?))
        {
            return SqlIntNull(property_info.GetValue(db_data, null) as int?);
        }

        throw new NotImplementedException();
    }

    public static string SqlInt(int val)
    {
        return val.ToString();
    }

    public static string SqlIntNull(int? val)
    {
        if (val == null)
        {
            return "NULL";
        }

        if (val == 0)
        {
            return "NULL";
        }

        return val.ToString();
    }

    public static string SqlString(string val)
    {
        return SqlString(val, false);
    }

    public static string SqlString(string val, bool KeepCase)
    {
        if (string.IsNullOrEmpty(val))
        {
            return "NULL";
        }

        return "'" + ((!KeepCase)?val.ToUpper():val).Replace("'","''") + "'";
    }

    protected override void Render(HtmlTextWriter writer)
    {   
        try
        {
            writer.Write(
                GetType()
                    .GetMethod(Method)
                    .Invoke(
                        this,
                        null));
        }
        catch (Exception e)
        {
            writer.Write(
                "ERR:"
                + e.GetBaseException()
                    .Message);
        }
    }

    protected static int DbExecute(string            query,
                                 ref SqlConnection connection)
    {
        connection = new SqlConnection(CONNECTIONSTRING);
        var cmd = new SqlCommand();

        Debug.WriteLine(string.Empty);
        Debug.WriteLine(query);
        Debug.WriteLine(string.Empty);

        cmd.CommandText = query;
        cmd.CommandType = CommandType.Text;
        cmd.Connection  = connection;

        connection.Open();
        var res = cmd.ExecuteNonQuery();
        connection.Close();
        connection.Dispose();
        return res;
    }

    private static SqlDataReader DbReader(string            query,
                                          ref SqlConnection connection)
    {
        connection = new SqlConnection(CONNECTIONSTRING);
        var cmd = new SqlCommand();

        Debug.WriteLine(string.Empty);
        Debug.WriteLine(query);
        Debug.WriteLine(string.Empty);

        cmd.CommandText = query;
        cmd.CommandType = CommandType.Text;
        cmd.Connection  = connection;

        connection.Open();

        var reader = cmd.ExecuteReader();
        return reader;
    }

    private static object DbReaderScalar(string            query,
                                          ref SqlConnection connection)
    {
        connection = new SqlConnection(CONNECTIONSTRING);
        var cmd = new SqlCommand();

        Debug.WriteLine(string.Empty);
        Debug.WriteLine(query);
        Debug.WriteLine(string.Empty);

        cmd.CommandText = query;
        cmd.CommandType = CommandType.Text;
        cmd.Connection  = connection;

        connection.Open();

        var reader = cmd.ExecuteScalar();

        var res = cmd.ExecuteNonQuery();
        connection.Close();
        connection.Dispose();

        return res;
    }

    public string ScadenzeGetAll(string p_cliente, string p_utente, string p_filter, string p_date_start, string p_date_end)
    {
        var res = new List<SCADENZE>();

        var db_utenti = Dynamic<UTENTI>(
            query: new Orm()
                .Select()
                .From(nameof(UTENTI))
                .Build()
        );

        var db_clienti = Dynamic<CLIENTI>(
            query: new Orm()
                .Select()
                .From(nameof(CLIENTI))
                .Build()
        );

        var db_scadenze = Dynamic<SCADENZE>(
            query: new Orm()
                .Select(
                    "[SCADENZE].*,"
                    + "[SCADENZE_CLIENTI].CLIENTE_ID AS RO_CLIENTE_ID,"
                    + "[SCADENZE_UTENTI].UTENTE_ID AS RO_UTENTE_ID")
                .From(nameof(SCADENZE))
                .OuterJoin("[SCADENZE_UTENTI]")
                .OuterOn("[SCADENZE].ID = [SCADENZE_UTENTI].SCADENZA_ID")
                .OuterJoin("[SCADENZE_CLIENTI]")
                .OuterOn("[SCADENZE].ID = [SCADENZE_CLIENTI].SCADENZA_ID")
                .Where("[SCADENZE_CLIENTI].CLIENTE_ID = " + p_cliente, !string.IsNullOrEmpty(p_cliente))
                .Where("[SCADENZE_UTENTI].UTENTE_ID = " + p_utente, !string.IsNullOrEmpty(p_utente))
                .Where("[SCADENZE].NAME LIKE '%" + p_filter + "%'", !string.IsNullOrEmpty(p_filter))
                .Build()
        );

        foreach (var db_scadenza_group in db_scadenze.GroupBy(x => x.ID))
        {
            var scadenza = db_scadenze.First(x => x.ID == db_scadenza_group.Key);

            scadenza.RO_UTENTI = string.Empty;
            foreach (var scadenze in db_scadenze.Where(x => x.ID == db_scadenza_group.Key)
                .ToList())
            {
                if (scadenze.RO_UTENTE_ID == 0)
                {
                    continue;
                }

                var utente = db_utenti.Single(x => x.ID == scadenze.RO_UTENTE_ID)
                    .COGNOME;
                if (!scadenza.RO_UTENTI.Contains(utente))
                {
                    scadenza.RO_UTENTI += utente + ", ";
                }
            }

            scadenza.RO_UTENTI = scadenza.RO_UTENTI.Trim()
                .TrimEnd(',');

            scadenza.RO_CLIENTI = string.Empty;
            foreach (var scadenze in db_scadenze.Where(x => x.ID == db_scadenza_group.Key))
            {
                if (scadenze.RO_CLIENTE_ID == 0)
                {
                    continue;
                }

                var cliente = db_clienti.Single(x => x.ID == scadenze.RO_CLIENTE_ID)
                    .NAME;
                if (!scadenza.RO_CLIENTI.Contains(cliente))
                {
                    scadenza.RO_CLIENTI += cliente + ", ";
                }
            }

            scadenza.RO_CLIENTI = scadenza.RO_CLIENTI.Trim()
                .TrimEnd(',');

            scadenza.RO_SCADENZA_REALE = scadenza.DATE.Value;

            for (var i = 0; ;
                 i++)
            {
                if ((scadenza.REC == 0) || (scadenza.RO_SCADENZA_REALE.Date >= DateTime.Now.Date))
                {
                    break;
                }

                scadenza.RO_SCADENZA_REALE = scadenza.RO_SCADENZA_REALE.AddMonths(scadenza.REC);
            }

            if (scadenza.RO_SCADENZA_REALE.Date < DateTime.Now.Date)
            {
                //continue;
            }

            if (!string.IsNullOrEmpty(p_date_start))
            {
                var date_start = DateTime.ParseExact(p_date_start, "yyyy-MM-dd", CultureInfo.CurrentCulture);
                if (scadenza.RO_SCADENZA_REALE.Date < date_start.Date)
                {
                    continue;
                }
            }

            if (!string.IsNullOrEmpty(p_date_end))
            {
                var date_end = DateTime.ParseExact(p_date_end, "yyyy-MM-dd", CultureInfo.CurrentCulture);
                if (scadenza.RO_SCADENZA_REALE.Date > date_end.Date)
                {
                    continue;
                }
            }

            res.Add(scadenza);
        }

        res = res.OrderBy(x => x.RO_SCADENZA_REALE)
            .ToList();

        return res.Serialize();
    }

    public class Reflection
    {
        public void FillObjectWithProperty(ref object objectTo,
                                           string     propertyName,
                                           object     propertyValue)
        {
            if (objectTo == DBNull.Value)
            {
                return;
            }

            if (propertyValue == DBNull.Value)
            {
                return;
            }

            if (propertyValue == typeof(DBNull))
            {
                return;
            }

            var tOb2 = objectTo.GetType();

            try
            {
                tOb2.GetProperty(propertyName)
                    ?
                    .SetValue(objectTo, propertyValue);
            }
            catch (Exception e) { }
        }
    }
}