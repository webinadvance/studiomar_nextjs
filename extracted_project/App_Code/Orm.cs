using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

public class Orm
{
    private readonly List<string> JOIN = new List<string>();

    private readonly List<string> OUTERJOIN = new List<string>();

    private readonly List<string> ON = new List<string>();

    private readonly List<string> ONOUTER = new List<string>();

    private readonly List<string> SELECT = new List<string>();

    private readonly List<string> WHERE = new List<string>();

    private string DELETEFROM;

    private string FROM;

    private string ORDERBY;

    public StringBuilder Build()
    {
        var builder = new StringBuilder();
        if (this.FROM != null)
        {
            builder.Append(" SELECT ");
        }

        if (this.DELETEFROM != null)
        {
            builder.Append(" DELETE FROM " + this.DELETEFROM + " ");
        }

        this.SELECT.ForEach(
            x => { builder.Append(" " + x + ", "); });
        if (this.SELECT.Count > 0)
        {
            builder.Remove(builder.Length - 2, 2);
        }

        if (this.FROM != null)
        {
            builder.Append(" FROM ");
            builder.Append(" " + this.FROM + " ");
        }

        var i = 0;
        this.JOIN.ForEach(
            x =>
            {
                builder.Append(" INNER JOIN " + x + " ON ");
                builder.Append(" " + this.ON[i]   + " ");
                i++;
            });

        i = 0;

        this.OUTERJOIN.ForEach(
            x =>
            {
                builder.Append(" LEFT OUTER JOIN " + x + " ON ");
                builder.Append(" " + this.ONOUTER[i] + " ");
                i++;
            });

        builder.Append(" WHERE 1=1 ");
        this.WHERE.ForEach(
            x => { builder.Append(" AND " + x + " "); });
        if (this.ORDERBY != null)
        {
            builder.Append(" ORDER BY " + this.ORDERBY + " ");
        }

        Debug.WriteLine(builder.ToString());

        return builder;
    }

    public Orm DeleteFrom(string s)
    {
        this.DELETEFROM = s;
        return this;
    }

    public Orm From(string s)
    {
        this.FROM = s;
        return this;
    }

    public Orm Join(string s)
    {
        this.JOIN.Add(s);
        return this;
    }


    public Orm OuterJoin(string s)
    {
        this.OUTERJOIN.Add(s);
        return this;
    }

    public Orm On(string s)
    {
        this.ON.Add(s);
        return this;
    }

    public Orm OuterOn(string s)
    {
        this.ONOUTER.Add(s);
        return this;
    }

    public Orm OrderBy(string s)
    {
        this.ORDERBY = s;
        return this;
    }

    public Orm Select(string s)
    {
        this.SELECT.Add(s);
        return this;
    }

    public Orm Select()
    {
        this.SELECT.Add("*");
        return this;
    }

    public Orm Where(string s,
                     bool   b = true)
    {
        if (b)
        {
            this.WHERE.Add(s);
        }

        return this;
    }

    public Orm WhereID(int i)
    {
        this.WHERE.Add(" " + (this.FROM ?? this.DELETEFROM) + ".ID = " + i);
        return this;
    }
}