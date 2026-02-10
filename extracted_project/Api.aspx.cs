using Model;
using Model.Enums;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Web;

public partial class Api : PageApi
{
    public string CourseUnBook(object course_data_people_id)
    {
        var people = Dynamic<PEOPLE>(
                new Orm()
                    .Select()
                    .From(nameof(PEOPLE))
                    .Join(nameof(COURSE_DATA_PEOPLE))
                    .On("[COURSE_DATA_PEOPLE].[PEOPLE_ID] = [PEOPLE].[ID]")
                    .Where("[COURSE_DATA_PEOPLE].[ID] = " + course_data_people_id)
                    .Build())
            .SingleOrDefault();

        var course_data = Dynamic<COURSE_DATA>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE_DATA))
                    .Join(nameof(COURSE_DATA_PEOPLE))
                    .On("[COURSE_DATA_PEOPLE].[COURSE_DATA_ID] = [COURSE_DATA].[ID]")
                    .Where("[COURSE_DATA_PEOPLE].[ID] = " + course_data_people_id)
                    .Build())
            .SingleOrDefault();

        var course_data_people = Dynamic<COURSE_DATA>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE_DATA_PEOPLE))
                    .Where("[COURSE_DATA_PEOPLE].[ID] = " + course_data_people_id)
                    .Build())
            .SingleOrDefault();

        var course = Dynamic<COURSE>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE))
                    .Join(nameof(COURSE_DATA))
                    .On("[COURSE_DATA].[COURSE_ID] = [COURSE].[ID]")
                    .Where("[COURSE_DATA].[ID] = " + course_data.ID)
                    .Build())
            .SingleOrDefault();

        if (IsCrossfit(course) && !DbCanBookCrossfit(people))
        {
            people.ACCESSES_CROSSFIT++;
        }

        if (IsCorsi(course) && !DbCanBookCorsi(people))
        {
            people.ACCESSES_COURSE++;
        }

        try
        {
            var buildert = new StringBuilder();
            buildert.Append(" SELECT * FROM PEOPLE P");
            buildert.Append(" INNER JOIN COURSE_DATA CD ON CD.TRAINER_ID = P.ID ");
            buildert.Append(" WHERE CD.ID = " + course_data.ID);

            var trainer = Dynamic<PEOPLE>(buildert)
                .FirstOrDefault();

            course_data.WEEK = course_data_people.WEEK;

            if (!string.IsNullOrEmpty(trainer.EMAIL))
            {
                Mail.SendMail(
                    trainer.EMAIL, File.ReadAllText(
                            HttpContext.Current.Server.MapPath("/Mail/unbook.txt")
                        )
                        .Replace(
                            "[[TRAINER_NAME]]", trainer.FIRSTNAME.ToUpper() + " " + trainer.LASTNAME.ToUpper()
                        )
                        .Replace(
                            "[[PEOPLE_NAME]]", people.FIRSTNAME.ToUpper() + " " + people.LASTNAME.ToUpper()
                        )
                        .Replace(
                            "[[RO_COURSE_NAME]]", course.NAME.ToUpper()
                        )
                        .Replace(
                            "[[DATE]]", this.UtilGetDate(course_data)
                                .ToString()
                        ), "Prenotazione corso" + " " + course.NAME.ToUpper());
            }
        }
        catch (Exception e) { }

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM COURSE_DATA_PEOPLE ");
        builder.Append(" WHERE ID = " + course_data_people_id);

        Execute(builder);

        return Execute(
            DbAutoSave(
                people,
                nameof(PEOPLE.ACCESSES_CROSSFIT),
                nameof(PEOPLE.ACCESSES_COURSE)));
    }

    public string DbAccessByUserID()
    {
        long id = this.DATA;

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(ANVIZ_ACCESS) + " ");
        builder.Append(" WHERE " + nameof(ANVIZ_ACCESS.PEOPLE_id) + " = " + id);
        builder.Append(" ORDER BY " + nameof(ANVIZ_ACCESS.TIME) + " DESC ");
        return Json(builder);
    }

    public string DbAccessGetAll()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        var builder = new StringBuilder();
        builder.Append(" SELECT TOP 100 ");
        builder.Append(" " + nameof(ANVIZ_ACCESS.TIME) + ",");
        builder.Append(" " + nameof(ANVIZ_ACCESS.PEOPLE_id) + ",");
        builder.Append(" [PEOPLE].[PROFILE_PIC] as " + nameof(ANVIZ_ACCESS.RO_PROFILE_PIC) + ",");
        builder.Append(" {fn CONCAT(PEOPLE.LASTNAME, {fn CONCAT(' ', PEOPLE.FIRSTNAME)}) } AS " + nameof(ANVIZ_ACCESS.RO_PEOPLE_NAME) + ",");
        builder.Append(this.SqlPeople_RO_ERROR());
        builder.Append(" FROM " + nameof(ANVIZ_ACCESS) + " ");
        builder.Append(" INNER JOIN " + nameof(PEOPLE) + " ON PEOPLE.ID = " + nameof(ANVIZ_ACCESS.PEOPLE_id));
        builder.Append(" WHERE 1=1 AND ANVIZ_ACCESS.TIME IS NOT NULL");
        builder.Append(" ORDER BY " + nameof(ANVIZ_ACCESS.TIME) + " DESC ");

        var res = Dynamic<ANVIZ_ACCESS>(builder);

        if (!string.IsNullOrEmpty(this.DATA?.status?.ToString()))
        {
            res = res.Where(x => (x.RO_ERROR != null) && (x != null) && x.RO_ERROR.Equals(this.DATA?.status?.ToString(), StringComparison.InvariantCultureIgnoreCase))
                .ToList();
        }

        return res.Serialize();
    }

    public string DbActionsDelete()
    {
        long id = this.DATA?.ID;

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(PEOPLE_ACTIONS) + " ");
        builder.Append(" WHERE ID = " + id);
        return Execute(builder);
    }

    public string DbActionsGetByID()
    {
        long id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<PEOPLE_ACTIONS>
                   {
                       new PEOPLE_ACTIONS
                       {
                           IS_ACTIVE = true,
                           DATE      = DateTime.Now
                       }
                   }.ToArray()
                .Serialize();
        }

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(PEOPLE_ACTIONS) + " ");
        builder.Append(" WHERE " + nameof(PEOPLE_ACTIONS.ID) + " = " + id);
        return Json(builder);
    }

    public string DbActionsGetByUserID()
    {
        long id = this.DATA;

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(PEOPLE_ACTIONS) + " ");
        builder.Append(" WHERE " + nameof(PEOPLE_ACTIONS.PEOPLE_id) + " = " + id);
        builder.Append(" ORDER BY " + nameof(PEOPLE_ACTIONS.DATE) + " DESC ");
        return Json(builder);
    }

    public string DbScadenzeSave()
    {

        this.CheckLogin(EPROFILE.ADMINISTRATOR);

        Execute(DbAutoSave(((object)this.DATA).ToString().Deserialize<SCADENZE>()));

        SCADENZE scadenza_db = null;

        if (this.DATA.ID == 0)
        {
            scadenza_db = Dynamic<SCADENZE>(
                new Orm()
           .Select("TOP 1 *")
           .From(nameof(SCADENZE))
           .OrderBy("ID DESC")
           .Build()).FirstOrDefault();
        }
        else
        {
            scadenza_db = Dynamic<SCADENZE>(
               new Orm()
          .Select("TOP 1 *")
          .From(nameof(SCADENZE))
          .WhereID((int)this.DATA.ID)
          .Build()).FirstOrDefault();
        }


        Execute(
            new Orm()
                .DeleteFrom(nameof(SCADENZE_UTENTI))
                .Where("SCADENZA_ID = " + scadenza_db.ID)
                .Build());

        foreach (string utente_id in this.DATA.RO_UTENTI.ToString().Split('|'))
        {
            Execute(
                DbAutoSave(
                    new SCADENZE_UTENTI()
                    {
                        SCADENZA_ID = scadenza_db.ID,
                        UTENTE_ID = utente_id.ToInt()
                    }));
        }

        Execute(
            new Orm()
                .DeleteFrom(nameof(SCADENZE_CLIENTI))
                .Where("SCADENZA_ID = " + scadenza_db.ID)
                .Build());

        foreach (string cliente_id in this.DATA.RO_CLIENTI.ToString().Split('|'))
        {
            Execute(
                DbAutoSave(
                    new SCADENZE_CLIENTI()
                    {
                        SCADENZA_ID = scadenza_db.ID,
                        CLIENTE_ID = cliente_id.ToInt()
                    }));
        }

        return "1";
    }

    public string DbScadenzeDelete()
    {

        this.CheckLogin(EPROFILE.ADMINISTRATOR);

        return Execute(
            new Orm()
                .DeleteFrom(nameof(SCADENZE))
                .WhereID((int)DATA.ID)
                .Build());
    }

    public string DbActionsSave()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<PEOPLE_ACTIONS>()));
    }

    public string DbCardDelete()
    {
        int id = this.DATA?.ID;
        var user = this.CheckLogin();

        var builder = new StringBuilder();
        builder.Append("SELECT * FROM CARD WHERE ID = " + id);
        var card = Dynamic<CARD>(builder)
            .FirstOrDefault();

        if ((card.TRAINER_ID != user.ID) && (card.MOD_USER_ID != user.ID))
        {
            throw new Exception("non puoi elminiare una scheda che non è tua");
        }

        Json(
            new Orm()
                .DeleteFrom(nameof(CARD))
                .WhereID(id)
                .Build()
        );

        return 1.Serialize();
    }

    public string DbCardDetailDelete()
    {
        int id = this.DATA?.ID;

        Json(
            new Orm()
                .DeleteFrom(nameof(CARD_DETAILS))
                .WhereID(id)
                .Build()
        );

        return 1.Serialize();
    }

    public string DbCardDetailGetByID()
    {
        int id = this.DATA?.ID;

        return Json(
            new Orm()
                .Select()
                .From(nameof(CARD_DETAILS))
                .WhereID(id)
                .Build()
        );
    }

    public string DbCardDetailSave()
    {
        var cd = ((object)this.DATA).ToString()
            .Deserialize<CARD_DETAILS>();

        if (cd.ID == 0)
        {
            var builder = new StringBuilder();

            // builder.Append("SELECT MAX([ORDER]) FROM [CARD_DETAILS] WHERE [CARD_ID] = " + SqlInt(cd.CARD_ID) + " AND [GROUP] = " + SqlString(cd.GROUP));
            builder.Append("SELECT MAX([ORDER]) FROM [CARD_DETAILS] WHERE [CARD_ID] = " + SqlInt(cd.CARD_ID));
            var max = Scalar(builder)
                .ToInt();
            cd.ORDER = max + 1;
            cd.GROUP = "A";
        }

        return Execute(
            DbAutoSave(cd, KeepCase: true));
    }

    public string DbCardDetailsByCardID()
    {
        int id = this.DATA?.ID;

        return Json(
            new Orm()
                .Select("[CARD_DETAILS].[ID] AS ID")
                .Select("[CARD_DETAILS].[ORDER] AS [ORDER]")
                .Select("[CARD_DETAILS].[SETS] AS [SETS]")
                .Select("[CARD_DETAILS].[REPS] AS [REPS]")
                .Select("[CARD_DETAILS].[REST] AS [REST]")
                .Select("[CARD_DETAILS].[GROUP] AS [GROUP]")
                .Select("[CARD_DETAILS].[METHOD] AS [METHOD]")
                .Select("[EXERCISE].[NAME] AS " + nameof(CARD_DETAILS.RO_EXERCISE_NAME))
                .Select("[EXERCISE].[URL] AS " + nameof(CARD_DETAILS.RO_EXERCISE_URL))
                .From(nameof(CARD_DETAILS))
                .Join(nameof(EXERCISE))
                .On("[CARD_DETAILS].[EXERCISE_ID] = [EXERCISE].[ID]")
                .Where(" [CARD_DETAILS].[CARD_ID] = " + id)

                // .OrderBy("[CARD_DETAILS].[GROUP],[CARD_DETAILS].[ORDER]")
                .Build()
        );
    }

    public string DbCardDetailsRepsSetsByCardID()
    {
        int id = this.DATA?.ID;
        int reps = this.DATA?.REPS;

        var builder = new StringBuilder();
        builder.Append(" UPDATE [CARD_DETAILS] SET [REPS] = " + SqlInt(reps) + " WHERE [CARD_ID] = " + SqlInt(id));
        return Json(builder);
    }

    public string DbCardDetailsSetRestByCardID()
    {
        int id = this.DATA?.ID;
        int rest = this.DATA?.REST;

        var builder = new StringBuilder();
        builder.Append(" UPDATE [CARD_DETAILS] SET [REST] = " + SqlInt(rest) + " WHERE [CARD_ID] = " + SqlInt(id));
        return Json(builder);
    }

    public string DbCardDetailsSetSetsByCardID()
    {
        int id = this.DATA?.ID;
        int sets = this.DATA?.SETS;

        var builder = new StringBuilder();
        builder.Append(" UPDATE [CARD_DETAILS] SET [SETS] = " + SqlInt(sets) + " WHERE [CARD_ID] = " + SqlInt(id));
        return Json(builder);
    }

    public string DbCardGetAll()
    {
        return Json(
            query: new Orm()
                .Select("[CARD].[ID]")
                .Select("[CARD].[NAME]")
                .Select("[CARD].[DESC]")
                .Select("[CARD].[DURATION]")
                .Select("[CARD].[LEVEL]")
                .Select("[CARD].[TRAINER_ID]")
                .Select("[CARD].[FREQ]")
                .Select("[PEOPLE_PT].[PATENT] AS [RO_PATENT]")
                .Select("{fn CONCAT([PEOPLE].LASTNAME, {fn CONCAT(' ', [PEOPLE].FIRSTNAME)}) } AS " + nameof(CARD.RO_PT_NAME) + string.Empty)
                .From(nameof(CARD))
                .Join(nameof(PEOPLE))
                .On("[CARD].[TRAINER_ID] = [PEOPLE].[ID]")
                .Join(nameof(PEOPLE_PT))
                .On("[CARD].[TRAINER_ID] = [PEOPLE_PT].[PEOPLE_ID]")
                .Build()
        );
    }

    public string DbCardGetByID()
    {
        int id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<CARD>
                   {
                       new CARD()
                   }.ToArray()
                .Serialize();
        }

        return Json(
            new Orm()
                .Select()
                .From(nameof(CARD))
                .WhereID(id)
                .Build()
        );
    }

    public string DbCardgetMin()
    {
        var people = this.DbLogin();

        return Json(
            new Orm()
                .Select()
                .From(nameof(CARD))
                .Build());
    }

    public string DbCardSave()
    {
        var user = this.CheckLogin();

        var builder = new StringBuilder();
        builder.Append("SELECT * FROM CARD WHERE ID = " + this.DATA.ID);
        var card = Dynamic<CARD>(builder)
            .FirstOrDefault();

        if (card != null)
        {
            if ((card.TRAINER_ID != user.ID) && (card.MOD_USER_ID != user.ID))
            {
                throw new Exception("non puoi modificare una scheda che non è tua");
            }
        }

        return Execute(
            DbAutoSave(
                db_data: ((object)this.DATA).ToString()
                .Deserialize<CARD>(),
                user_id: user.ID));
    }

    public string DbCardSwitchOrder()
    {
        int new_id = this.DATA?.new_id;
        int old_id = this.DATA?.old_id;
        int card_id = this.DATA?.card_id;

        var builder = new StringBuilder();

        builder.Clear();
        builder.Append("SELECT * FROM [CARD_DETAILS] WHERE [ID] = " + old_id);
        var old_card_detail = Dynamic<CARD_DETAILS>(builder)
            .SingleOrDefault();

        builder.Clear();
        builder.Append("SELECT * FROM [CARD_DETAILS] WHERE [ID] = " + new_id);
        var new_card_detail = Dynamic<CARD_DETAILS>(builder)
            .SingleOrDefault();

        builder.Clear();
        builder.Append("UPDATE [CARD_DETAILS] SET [ORDER] = " + old_card_detail.ORDER + " WHERE [ID] = " + new_card_detail.ID + " AND [CARD_ID] = " + card_id);
        Json(builder);

        builder.Clear();
        builder.Append("UPDATE [CARD_DETAILS] SET [ORDER] = " + new_card_detail.ORDER + " WHERE [ID] = " + old_card_detail.ID + " AND [CARD_ID] = " + card_id);
        Json(builder);

        return 1.Serialize();
    }

    public string DbClubDelete()
    {
        long id = this.DATA?.ID;

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(CLUB) + " ");
        builder.Append(" WHERE ID = " + id);
        return Execute(builder);
    }

    public string DbUtentiDelete()
    {
        long id = this.DATA?.ID;

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(UTENTI) + " ");
        builder.Append(" WHERE ID = " + id);
        return Execute(builder);
    }

    public string DbClientiDelete()
    {
        long id = this.DATA?.ID;

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(CLIENTI) + " ");
        builder.Append(" WHERE ID = " + id);
        return Execute(builder);
    }

    public string DbClubGetByDomain()
    {
        return Json(
            new Orm()
                .Select("*")
                .From(nameof(CLUB))
                .Where(nameof(CLUB.DOMAIN) + " = " + SqlString(this.DOMAIN))
                .Build());
    }

    public string DbClubGetByID()
    {
        long id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<CLUB>
                   {
                       new CLUB()
                   }.ToArray()
                .Serialize();
        }

        return Json(
            new Orm()
                .Select("*")
                .From(nameof(CLUB))
                .Where(nameof(CLUB.ID) + " = " + id)
                .Build());
    }

    public string DbUtentiGetByID()
    {
        long id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<UTENTI>
                   {
                       new UTENTI()
                   }.ToArray()
                .Serialize();
        }

        return Json(
            new Orm()
                .Select("*")
                .From(nameof(UTENTI))
                .Where(nameof(UTENTI.ID) + " = " + id)
                .Build());
    }

    public string DbClientiGetByID()
    {
        long id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<CLIENTI>
                   {
                       new CLIENTI()
                   }.ToArray()
                .Serialize();
        }

        return Json(
            new Orm()
                .Select("*")
                .From(nameof(CLIENTI))
                .Where(nameof(CLIENTI.ID) + " = " + id)
                .Build());
    }

    public string DbClubGetFull()
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" C.ID AS ID, ");
        builder.Append(" C.ADDRESS AS ADDRESS, ");
        builder.Append(" C.[DOMAIN] AS [DOMAIN], ");
        builder.Append(" C.NAME AS NAME, ");
        builder.Append(" (SELECT COUNT(*) FROM PEOPLE WHERE PEOPLE.CLUB_ID = C.ID AND PEOPLE.IS_ACTIVE = 1) AS " + nameof(CLUB.RO_AFFILIEATES) + " ");
        builder.Append(" FROM CLUB AS C ");
        builder.Append(" WHERE [C].[IS_ADMIN] = 0 ");
        return Json(builder);
    }

    public string DbClubGetMin()
    {
        var people = this.DbLogin();

        if (this.ISLOCALHOST)
        {
            return Json(
                new Orm()
                    .Select()
                    .From(nameof(CLUB))
                    .Build());
        }

        return Json(
            new Orm()
                .Select()
                .From(nameof(CLUB))
                .Where("[CLUB].[DOMAIN] = " + SqlString(this.DOMAIN))
                .Build());
    }

    public string DbClubGetMinPublic()
    {
        return Json(
            new Orm()
                .Select()
                .From(nameof(CLUB))
                .OrderBy("[CLUB].[IS_ADMIN] DESC, [CLUB].[NAME]")
                .Build());
    }

    public string DbClubSave()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<CLUB>()));
    }

    public string DbUtentiSave()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR);

        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<UTENTI>()));
    }

    public string DbClientiSave()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR);

        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<CLIENTI>()));
    }

    public string DbCourseBook()
    {
        var course_data = ((object)this.DATA).ToString()
            .Deserialize<COURSE_DATA>();

        var people_id = course_data.RO_COURSE_DATA_PEOPLE_ID;

        var week = course_data.WEEK;

        course_data = Dynamic<COURSE_DATA>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE_DATA))
                    .Where("[COURSE_DATA].[ID] = " + course_data.ID)
                    .Build())
            .SingleOrDefault();

        var course_data_people_count = Dynamic<COURSE_DATA_PEOPLE>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE_DATA_PEOPLE))
                    .Where("[COURSE_DATA_PEOPLE].[COURSE_DATA_ID] = " + course_data.ID + "  AND [COURSE_DATA_PEOPLE].[WEEK] = " + week)
                    .Build())
            .Count();

        if (course_data.PLACES <= course_data_people_count)
        {
            throw new Exception("non ci sono più posti disponibili per questa data!");
        }

        var people = this.DbLogin();

        if ((people_id == null) || (people_id == 0))
        {
            people_id = people
                .ID;
        }

        var course = Dynamic<COURSE>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE))
                    .Join(nameof(COURSE_DATA))
                    .On("[COURSE_DATA].[COURSE_ID] = [COURSE].[ID]")
                    .Where("[COURSE_DATA].[ID] = " + course_data.ID)
                    .Build())
            .SingleOrDefault();

        var builder = new StringBuilder();
        builder.Append(" SELECT * FROM PEOPLE");
        builder.Append(" WHERE PEOPLE.ID = " + people_id);
        people = Dynamic<PEOPLE>(builder)
            .SingleOrDefault();

        DbBookCondition(course, people);

        builder = new StringBuilder();
        builder.Append(" SELECT * FROM PEOPLE P");
        builder.Append(" INNER JOIN COURSE_DATA CD ON CD.TRAINER_ID = P.ID ");
        builder.Append(" WHERE CD.ID = " + course_data.ID);

        Execute(
            DbAutoSave(
                new COURSE_DATA_PEOPLE
                {
                    PEOPLE_id = people_id,
                    COURSE_DATA_id = course_data.ID,
                    IS_ACTIVE = true,
                    WEEK = week
                }));

        var trainer = Dynamic<PEOPLE>(builder)
            .FirstOrDefault();

        course_data.WEEK = week;

        try
        {
            if (!string.IsNullOrEmpty(trainer.EMAIL))
            {
                Mail.SendMail(
                    trainer.EMAIL, File.ReadAllText(
                            HttpContext.Current.Server.MapPath("/Mail/book.txt")
                        )
                        .Replace(
                            "[[TRAINER_NAME]]", trainer.FIRSTNAME.ToUpper() + " " + trainer.LASTNAME.ToUpper()
                        )
                        .Replace(
                            "[[PEOPLE_NAME]]", people.FIRSTNAME.ToUpper() + " " + people.LASTNAME.ToUpper()
                        )
                        .Replace(
                            "[[RO_COURSE_NAME]]", course.NAME.ToUpper()
                        )
                        .Replace(
                            "[[DATE]]", this.UtilGetDate(course_data)
                                .ToString()
                        ), "Prenotazione corso" + " " + course.NAME.ToUpper());
            }
        }
        catch (Exception e) { }

        if (IsCrossfit(course) && !DbCanBookCrossfit(people))
        {
            people.ACCESSES_CROSSFIT--;
        }

        if (IsCorsi(course) && !DbCanBookCorsi(people))
        {
            people.ACCESSES_COURSE--;
        }

        return Execute(
            DbAutoSave(
                people,
                nameof(PEOPLE.ACCESSES_CROSSFIT),
                nameof(PEOPLE.ACCESSES_COURSE)));
    }

    public string DbCourseDataDelete()
    {
        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(COURSE_DATA) + " ");
        builder.Append(" WHERE ID = " + this.DATA);
        return Execute(builder);
    }

    public string DbCourseDataSave()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<COURSE_DATA>()));
    }

    public string DbCourseDetailGet()
    {
        var p_course_data_id = ((object)this.DATA?.course_data_id)?.ToString()
            .ToInt();
        var p_course_data_week = ((object)this.DATA?.course_data_week)?.ToString()
            .ToInt();

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" CDP.ID, ");
        builder.Append(" CDP.PEOPLE_id, ");
        builder.Append(" {fn CONCAT(P.LASTNAME, {fn CONCAT(' ', P.FIRSTNAME)}) } AS NAME ");
        builder.Append(" FROM COURSE_DATA_PEOPLE AS CDP ");
        builder.Append(" INNER JOIN PEOPLE AS P ON P.ID = CDP.PEOPLE_id ");
        builder.Append(" WHERE CDP.COURSE_DATA_id = " + p_course_data_id + " AND " + " CDP.WEEK = " + p_course_data_week);
        return Json(builder);
    }

    public string DbCourseDetailRemoveUser()
    {
        var p_course_data_id = ((object)this.DATA?.course_data_id)?.ToString()
            .ToInt();
        var p_course_data_week = ((object)this.DATA?.course_data_week)?.ToString()
            .ToInt();
        var p_people_id = ((object)this.DATA?.people_id)?.ToString()
            .ToInt();

        var builderc = new StringBuilder();
        builderc.Append(" SELECT * FROM PEOPLE");
        builderc.Append(" WHERE PEOPLE.ID = " + p_people_id);
        var people = Dynamic<PEOPLE>(builderc)
            .SingleOrDefault();

        var course_data = Dynamic<COURSE_DATA>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE_DATA))
                    .Where("[COURSE_DATA].[ID] = " + p_course_data_id)
                    .Build())
            .SingleOrDefault();

        var course = Dynamic<COURSE>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE))
                    .Join(nameof(COURSE_DATA))
                    .On("[COURSE_DATA].[COURSE_ID] = [COURSE].[ID]")
                    .Where("[COURSE_DATA].[ID] = " + course_data.ID)
                    .Build())
            .SingleOrDefault();

        if (IsCrossfit(course) && !DbCanBookCrossfit(people))
        {
            people.ACCESSES_CROSSFIT++;
        }

        if (IsCorsi(course) && !DbCanBookCorsi(people))
        {
            people.ACCESSES_COURSE++;
        }

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM COURSE_DATA_PEOPLE ");
        builder.Append(" WHERE COURSE_DATA_id = " + p_course_data_id + " AND " + " WEEK = " + p_course_data_week + " AND " + " PEOPLE_id = " + p_people_id);

        Execute(
            DbAutoSave(
                people,
                nameof(PEOPLE.ACCESSES_CROSSFIT),
                nameof(PEOPLE.ACCESSES_COURSE)));

        return Execute(builder);
    }

    public string DbCourseGetByCourseDataID()
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM COURSE AS C ");
        builder.Append(" INNER JOIN COURSE_DATA AS CD ON CD.COURSE_ID = C.ID ");
        builder.Append(" WHERE CD.ID = " + this.DATA);

        return Json(builder);
    }

    public string DbCourseGetByID()
    {
        var id = ((object)this.DATA).ToInt();

        if (id == 0)
        {
            return new List<COURSE_DATA>
                   {
                       new COURSE_DATA
                       {
                           IS_ACTIVE = true,
                           PLACES    = 10,
                           STIME     = string.Empty,
                           DAY       = EWEEKDAY.MONDAY.ToString()
                       }
                   }.ToArray()
                .Serialize();
        }

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(COURSE_DATA) + " ");
        builder.Append(" WHERE " + nameof(COURSE_DATA.ID) + " = " + id);
        return Json(builder);
    }

    public string DbCourseGetByPeopleID()
    {
        var currentweek = DateTime.Now.ToIso8601WeekOfYear();

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" C.NAME AS COURSE_NAME, ");
        builder.Append(
            SqlCourseDate() + " AS COURSE_DATE");
        builder.Append(" FROM COURSE_DATA_PEOPLE AS CDP ");
        builder.Append(" INNER JOIN COURSE_DATA AS CD ON CD.ID = CDP.COURSE_DATA_id ");
        builder.Append(" INNER JOIN COURSE AS C ON C.ID = CD.COURSE_ID ");
        builder.Append(" WHERE CDP.PEOPLE_ID = " + this.DATA + " AND CDP.WEEK >= " + currentweek);
        builder.Append(
            " ORDER BY (" + SqlCourseDate() + ")");

        return Json(builder);
    }

    public string DbCourseResume()
    {
        var course_data = ((object)this.DATA).ToString()
            .Deserialize<COURSE_DATA>();

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(COURSE_DATA_STATUS) + " ");
        builder.Append(" WHERE " + nameof(COURSE_DATA_STATUS.WEEK) + " = " + course_data.WEEK + " ");
        builder.Append(" AND " + nameof(COURSE_DATA_STATUS.COURSE_DATA_id) + " = " + course_data.ID + " ");
        return Execute(builder);
    }

    public string DbCourseSchedulingGetAll()
    {
        var p_active = ((object)this.DATA?.active)?.ToString()
            .ToEnum<EACTIVE>();

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" CD.ID, ");
        builder.Append(" CD.DAY, ");
        builder.Append(" CD.STIME, ");
        builder.Append(" C.NAME AS RO_COURSE_NAME, ");
        builder.Append(" P.LASTNAME AS RO_TRAINER_NAME ");
        builder.Append(" FROM COURSE_DATA AS CD ");
        builder.Append(" INNER JOIN PEOPLE AS P ON P.ID = CD.TRAINER_ID ");
        builder.Append(" INNER JOIN COURSE AS C ON C.ID = CD.COURSE_ID ");
        builder.Append(
            " WHERE CD."
            + nameof(COURSE_DATA.IS_ACTIVE)
            + " = "
            + ((p_active == null) || (p_active.Value == EACTIVE.ATTIVO)
                   ? "1"
                   : "0")
            + " ");
        builder.Append(" ORDER BY DAY,STIME ");
        return Json(builder);
    }

    public string DbCoursesGeAll()
    {
        this.CheckLogin();

        var CURRENTWEEK = DateTime.Now.ToIso8601WeekOfYear();

        var week = CURRENTWEEK;

        var p_week = ((object)this.DATA?.week)?.ToString()
            .ToEnum<EWEEK>();

        var p_address = ((object)this.DATA?.address)?.ToString();

        var p_orderby = ((object)this.DATA?.orderby)?.ToString();

        var p_club = ((object)this.DATA?.club)?.ToString()
            .ToInt();

        var p_active = ((object)this.DATA?.active)?.ToString()
            .ToEnum<EACTIVE>();

        if (p_week
            == EWEEK.SETTIMANA_PROSSIMA)
        {
            week++;
        }

        var builder_course_data = new StringBuilder();
        builder_course_data.Append(" SELECT ");
        builder_course_data.Append(nameof(COURSE_DATA.DATE) + ",");
        builder_course_data.Append(" COURSE_DATA.WEEK ,");
        builder_course_data.Append(" COURSE_DATA.IS_ACTIVE ,");
        builder_course_data.Append(nameof(COURSE_DATA.STIME) + ",");
        builder_course_data.Append(" " + nameof(COURSE_DATA) + ".ID ,");
        builder_course_data.Append(" COURSE_DATA_STATUS.ECOURSESTATUS AS " + nameof(COURSE_DATA.RO_STATUS) + ",");
        builder_course_data.Append(" CLUB.NAME AS " + nameof(COURSE_DATA.RO_CLUB_NAME) + ",");
        builder_course_data.Append(" CLUB.ADDRESS AS " + nameof(COURSE_DATA.RO_CLUB_ADDRSS) + ",");
        builder_course_data.Append(nameof(COURSE_DATA.PLACES) + ",");
        builder_course_data.Append(nameof(COURSE_DATA.DAY) + ",");
        builder_course_data.Append(" {fn CONCAT(PEOPLE.LASTNAME, {fn CONCAT(' ', PEOPLE.FIRSTNAME)}) } AS " + nameof(COURSE_DATA.RO_TRAINER_NAME) + ", ");
        builder_course_data.Append(" COURSE.NAME AS " + nameof(COURSE_DATA.RO_COURSE_NAME) + ", ");
        builder_course_data.Append(
            " (SELECT COUNT(COURSE_DATA_PEOPLE.PEOPLE_id) WHERE COURSE_DATA_PEOPLE.PEOPLE_id = "
            + this.DbLogin()
                .ID
            + " AND COURSE_DATA_PEOPLE.WEEK = "
            + week
            + ") AS "
            + nameof(COURSE_DATA.RO_MY_BOOKING)
            + ", ");
        builder_course_data.Append(" (SELECT COUNT(*) FROM COURSE_DATA_PEOPLE WHERE COURSE_DATA.ID=COURSE_DATA_PEOPLE.COURSE_DATA_id AND COURSE_DATA_PEOPLE.WEEK = " + week + ") AS RO_FREE_PLACES, ");
        builder_course_data.Append(" COURSE_DATA_PEOPLE.ID AS " + nameof(COURSE_DATA.RO_COURSE_DATA_PEOPLE_ID) + " ");
        builder_course_data.Append(" FROM " + nameof(COURSE_DATA) + " ");
        builder_course_data.Append(" INNER JOIN " + nameof(PEOPLE) + " ON PEOPLE.ID = COURSE_DATA.TRAINER_id " + " ");
        builder_course_data.Append(" INNER JOIN " + nameof(COURSE) + " ON COURSE.ID = " + nameof(COURSE_DATA.COURSE_id) + " ");
        builder_course_data.Append(" INNER JOIN " + nameof(CLUB) + " ON CLUB.ID = COURSE_DATA.CLUB_ID ");
        builder_course_data.Append(" LEFT OUTER JOIN " + nameof(COURSE_DATA_STATUS) + " ON COURSE_DATA_STATUS.COURSE_DATA_id = COURSE_DATA.ID AND COURSE_DATA_STATUS.WEEK = " + week + " ");
        builder_course_data.Append(" LEFT OUTER JOIN " + nameof(COURSE_DATA_PEOPLE) + " ON COURSE_DATA_PEOPLE.COURSE_DATA_id = COURSE_DATA.ID AND COURSE_DATA_PEOPLE.WEEK = " + week + " ");
        builder_course_data.Append(
            " WHERE COURSE_DATA."
            + nameof(COURSE_DATA.IS_ACTIVE)
            + " = "
            + ((p_active == null) || (p_active.Value == EACTIVE.ATTIVO)
                   ? "1"
                   : "0")
            + " ");
        if ((p_club != null) && (p_club != 0))
        {
            builder_course_data.Append(" AND CLUB.ID = " + p_club + " ");
        }

        builder_course_data.Append(" GROUP BY CLUB.ADDRESS,CLUB.NAME,COURSE_DATA.IS_ACTIVE,PEOPLE.ID,DATE,COURSE_DATA.WEEK,PLACES,STIME,DAY,PEOPLE.LASTNAME,PEOPLE.FIRSTNAME,COURSE.NAME,COURSE_DATA.ID,COURSE_DATA_PEOPLE.PEOPLE_id,COURSE_DATA_PEOPLE.WEEK,COURSE_DATA_PEOPLE.ID,COURSE_DATA_STATUS.ECOURSESTATUS ");
        var db_course_data = Dynamic<COURSE_DATA>(builder_course_data);

        if ((week != int.MaxValue) && (week > 0))
        {
            db_course_data.ToList()
                .ForEach(
                    action: x =>
                    {
                        x.WEEK = week;
                        x.DAY = new CultureInfo("en").DateTimeFormat.GetDayName(
                                x.DAY.ToEnum<EWEEKDAY>()
                                    .ToDayOfWeek())
                            .ToUpper();
                        x.DATE = this.UtilGetDate(x);
                        x.RO_STATUS = x.RO_STATUS
                                      ?? ((x.PLACES - x.RO_FREE_PLACES) == 0
                                              ? "pieno"
                                              : "aperto");
                    });
        }

        var res = new List<COURSE_DATA>();

        foreach (var course_data in db_course_data.Where(x => x.RO_MY_BOOKING != null)
            .ToList())
        {
            if (res.Count(x => x.ID == course_data.ID) > 0)
            {
                continue;
            }

            res.Add(course_data);
        }

        foreach (var course_data in db_course_data)
        {
            if (res.Count(x => x.ID == course_data.ID) > 0)
            {
                continue;
            }

            res.Add(course_data);
        }

        var courses = res.Where(x => this.UtilGetDate(x) > DateTime.Now)
            .OrderBy(
                keySelector: this.UtilGetDate)
            .ToList();

        foreach (var course_data in courses)
        {
            course_data.RO_CLUB_DSTNC = Maps.GetDistance(p_address, course_data.RO_CLUB_ADDRSS);
        }

        if (!string.IsNullOrEmpty(p_orderby))
        {
            courses = courses.OrderBy(
                    p_orderby
                    + " ascending")
                .ToList();
        }

        return courses
            .Serialize();
    }

    public string DbCoursesGetMin()
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" ID, NAME ");
        builder.Append(" FROM COURSE ");
        builder.Append(" ORDER BY NAME ");
        return Json(builder);
    }

    public string DbCourseSuspend()
    {
        var course_data = ((object)this.DATA).ToString()
            .Deserialize<COURSE_DATA>();

        var course_data_peoples = Dynamic<COURSE_DATA_PEOPLE>(
                new Orm()
                    .Select()
                    .From(nameof(COURSE_DATA_PEOPLE))
                    .Where("[COURSE_DATA_id] = " + course_data.ID + " AND [WEEK] = " + course_data.WEEK)
                    .Build())
            .ToList();

        foreach (var course_data_people in course_data_peoples)
        {
            this.CourseUnBook(course_data_people.ID);
        }

        return Execute(
            DbAutoSave(
                new COURSE_DATA_STATUS
                {
                    ECOURSESTATUS = ECOURSESTATUS.SUSPENDED.ToString(),
                    COURSE_DATA_id = course_data.ID,
                    IS_ACTIVE = true,
                    WEEK = course_data.WEEK
                }));
    }

    public string DbCourseUnBook()
    {
        return this.CourseUnBook((object)this.DATA);
    }

    public string DbExerciseDelete()
    {
        int id = this.DATA?.ID;

        Json(
            new Orm()
                .DeleteFrom(nameof(EXERCISE))
                .WhereID(id)
                .Build()
        );

        return 1.Serialize();
    }

    public string DbExerciseGetAll()
    {
        return Json(
            query: new Orm()
                .Select()
                .From(nameof(EXERCISE))
                .Where(" " + nameof(EXERCISE.EMUSCLE) + " = " + SqlString((string)this.DATA?.muscle), !string.IsNullOrEmpty(((object)this.DATA?.muscle)?.ToString()))
                .OrderBy(nameof(EXERCISE.EMUSCLE) + "," + nameof(EXERCISE.NAME))
                .Build()
        );
    }

    public string DbUtentiGetAll()
    {
        return Json(
            query: new Orm()
                .Select()
                .From(nameof(UTENTI))
                .OrderBy(nameof(UTENTI.COGNOME))
                .Build()
        );
    }

    public string DbClientiGetAll()
    {
        return Json(
            query: new Orm()
                .Select()
                .From(nameof(CLIENTI))
                .OrderBy(nameof(CLIENTI.NAME))
                .Build()
        );
    }

    public string DbExerciseGetByID()
    {
        int id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<EXERCISE>
                   {
                       new EXERCISE()
                   }.ToArray()
                .Serialize();
        }

        return Json(
            new Orm()
                .Select()
                .From(nameof(EXERCISE))
                .WhereID(id)
                .Build()
        );
    }

    public string DbExerciseSave()
    {
        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<EXERCISE>(), KeepCase: true));
    }

    public string DbExercisesGetMin()
    {
        return Json(
            new Orm()
                .Select("[EXERCISE].[ID]")
                .Select("[EXERCISE].[NAME]")
                .From(nameof(EXERCISE))
                .Build()
        );
    }

    public string DbLocalizationGetAll()
    {
        // string GetIP()
        // {
        // return HttpContext.Current.Request.UserHostAddress;
        // }

        // if (!GetIP()
        // .Contains("::1"))
        // {
        // try
        // {
        // PageApi.Execute(
        // PageApi.DbAutoSave(
        // new SECURITY
        // {
        // IP = GetIP()
        // },
        // nameof(SECURITY.IP)
        // )
        // );
        // }
        // catch (Exception e) { }
        // }
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM LOCALIZATION ");
        return Json(builder);
    }

    public string DbLocalziationSave()
    {
        var data = ((object)this.DATA).ToString()
            .Deserialize<LOCALIZATION>();

        var builder = new StringBuilder();
        builder.Append(" INSERT INTO LOCALIZATION ");
        builder.Append(" (K, ITALIANO, ENGLISH) ");
        builder.Append(" VALUES (" + SqlString(data.K) + "," + SqlString(data.ITALIANO) + "," + SqlString(data.ENGLISH) + " ) ");
        return Json(builder);
    }

    public string DbPTDelete()
    {
        var builder2 = new StringBuilder();
        builder2.Append(" UPDATE PEOPLE SET TRAINER_ID = NULL ");
        builder2.Append(" WHERE TRAINER_ID = " + this.DATA);
        Execute(builder2);

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(PEOPLE_PT) + " ");
        builder.Append(" WHERE PEOPLE_ID = " + this.DATA);
        return Execute(builder);
    }

    public string DbPTGetAll()
    {
        string position = this.DATA?.address;

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" PT.ID AS ID, ");
        builder.Append(" PT.AREA AS AREA, ");
        builder.Append(" PT.PEOPLE_ID AS PEOPLE_ID, ");
        builder.Append(" P.EMAIL AS " + nameof(PEOPLE_PT.RO_MAIL) + ", ");
        builder.Append(" {fn CONCAT(P.LASTNAME, {fn CONCAT(' ', P.FIRSTNAME)}) } AS " + nameof(PEOPLE_PT.RO_PT_NAME) + ", ");
        builder.Append(" [P].[PROFILE_PIC] AS " + nameof(PEOPLE_PT.RO_PROFILE_PIC) + ", ");
        builder.Append(" [PT].[PATENT] AS " + nameof(PEOPLE_PT.PATENT) + ", ");
        builder.Append(" [P].[PHONE_NUMBER] AS " + nameof(PEOPLE_PT.RO_PHONE_NUMBER) + ", ");
        builder.Append(" [PT].[ADDRESS] AS " + nameof(PEOPLE_PT.ADDRESS) + ", ");
        builder.Append(" (SELECT COUNT(*) FROM [CARD] WHERE [CARD].[TRAINER_ID] = [PT].[PEOPLE_ID]) AS " + nameof(PEOPLE_PT.RO_CARDS) + " ");
        builder.Append(" FROM PEOPLE_PT AS PT ");
        builder.Append(" INNER JOIN PEOPLE P ON P.ID = PT.PEOPLE_ID ");
        var res = Dynamic<PEOPLE_PT>(builder);

        try
        {
            foreach (var people_pt in res)
            {
                people_pt.RO_DIST = Maps.GetDistance(position, people_pt.ADDRESS);
            }
        }
        catch (Exception e) { }

        return res.Serialize();
    }

    public string DbPTGetByID()
    {
        var id = ((object)this.DATA).ToInt();

        if (id == 0)
        {
            return new List<PEOPLE_PT>
                   {
                       new PEOPLE_PT()
                   }.ToArray()
                .Serialize();
        }

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(PEOPLE_PT) + " ");
        builder.Append(" WHERE " + nameof(PEOPLE_PT.ID) + " = " + id);
        return Json(builder);
    }

    public string DbPTGetClients()
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" {fn CONCAT(PEOPLE.LASTNAME, {fn CONCAT(' ', PEOPLE.FIRSTNAME)}) } AS NAME, ");
        builder.Append(" ID ");
        builder.Append(" FROM " + nameof(PEOPLE) + " ");
        builder.Append(" WHERE " + nameof(PEOPLE.TRAINER_ID) + " = " + this.DATA);
        return Json(builder);
    }

    public string DbPTSave()
    {
        return Execute(
            DbAutoSave(
                ((object)this.DATA).ToString()
                .Deserialize<PEOPLE_PT>()));
    }

    public string DbScadenzeByID()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR);

        var id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<SCADENZE>()
            {
                new SCADENZE()
            }.Serialize();
        }

        var res = Dynamic<SCADENZE>(
           new Orm()
               .Select()
               .From(nameof(SCADENZE))
               .Where("ID = " + id)
               .Build());

        List<SCADENZE_UTENTI> scadenze_utentis = Dynamic<SCADENZE_UTENTI>(
            new Orm()
                .Select()
                .From(nameof(SCADENZE_UTENTI))
                .Where("SCADENZA_ID = " + res[0].ID)
                .Build());

        List<SCADENZE_CLIENTI> scadenze_clientis = Dynamic<SCADENZE_CLIENTI>(
            new Orm()
                .Select()
                .From(nameof(SCADENZE_CLIENTI))
                .Where("SCADENZA_ID = " + res[0].ID)
                .Build());

        if (scadenze_utentis.Count > 0)
            ((SCADENZE)res[0]).RO_UTENTI = scadenze_utentis.Select(x => string.Format("{0}", x.UTENTE_ID)).Aggregate((current, next) => current + "|" + next);
        if (scadenze_clientis.Count > 0)
            ((SCADENZE)res[0]).RO_CLIENTI = scadenze_clientis.Select(x => string.Format("{0}", x.CLIENTE_ID)).Aggregate((current, next) => current + "|" + next);

        return ((object)res).Serialize();
    }

    public string DbScadenzeClientiGetMin()
    {
        var data = Dynamic<CLIENTI>(
            new Orm()
                .Select()
                .From(nameof(CLIENTI))
                .Build());

        return data.ToList()
            .OrderBy(x => x.NAME)
            .Select(
                x => new
                {
                    x.ID,
                    x.NAME
                })
            .ToList()
            .Serialize();
    }

    public string DbScadenzeGetAll()
    {
        string p_cliente = DATA?.cliente;
        string p_utente = DATA?.utente;
        string p_filter = DATA?.filter;
        string p_date_start = DATA?.date_start;
        string p_date_end = DATA?.date_end;

        return ScadenzeGetAll(p_cliente, p_utente, p_filter, p_date_start, p_date_end);

    }

    public string DbScadenzeUtentiGetMin()
    {
        var data = Dynamic<UTENTI>(
            new Orm()
                .Select()
                .From(nameof(UTENTI))
                .Build());

        return data.ToList()
            .OrderBy(x => x.COGNOME)
            .Select(
                x => new
                {
                    x.ID,
                    NAME = x.COGNOME
                })
            .ToList()
            .Serialize();
    }

    public string DbTrainersGetMin()
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" ID, ");
        builder.Append(" {fn CONCAT(PEOPLE.LASTNAME, {fn CONCAT(' ', PEOPLE.FIRSTNAME)}) } AS NAME ");
        builder.Append(" FROM PEOPLE ");
        builder.Append(" WHERE (" + nameof(PEOPLE.EPROFILE) + " = '" + EPROFILE.ADMINISTRATOR + "' ");
        builder.Append(" OR " + nameof(PEOPLE.EPROFILE) + " = '" + EPROFILE.STAFF + "' ");
        builder.Append(" OR " + nameof(PEOPLE.EPROFILE) + " = '" + EPROFILE.TRAINER + "') ");
        builder.Append(" ORDER BY LASTNAME ");
        return Json(builder);
    }

    public string DbTrainersRegistered()
    {
        return Json(
            new Orm()
                .Select("[PEOPLE].[ID]")
                .Select("{fn CONCAT([PEOPLE].LASTNAME, {fn CONCAT(' ', [PEOPLE].FIRSTNAME)}) } AS [NAME]")
                .From(nameof(PEOPLE_PT))
                .Join("[PEOPLE]")
                .On("[PEOPLE_PT].[PEOPLE_ID] = [PEOPLE].[ID]")
                .Build());
    }

    public string DbUploadProfileImage()
    {
        var virtual_path = "/Uploads/" + Guid.NewGuid() + ".jpg";
        var path = this.Server.MapPath(virtual_path);
        Image.FromStream(this.Request.InputStream, false)
            .Save(path, ImageFormat.Jpeg);
        return virtual_path;
    }

    public string DbUserChangePassword()
    {
        var db_data = ((object)this.DATA).ToString()
            .Deserialize<PEOPLE>();

        var user = this.DbLogin();

        user.PASSWORD = db_data.PASSWORD;

        return Execute(
            DbAutoSave(
                user,
                nameof(PEOPLE.PASSWORD)));
    }

    public string DbUserDelete()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR);

        long id = this.DATA?.ID;

        var builder = new StringBuilder();
        builder.Append(" DELETE FROM " + nameof(PEOPLE) + " ");
        builder.Append(" WHERE ID = " + id);
        return Execute(builder);
    }

    public string DbUserGetAll()
    {
        var people = this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.ID) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.LASTNAME) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.FIRSTNAME) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.PHONE_NUMBER) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.IS_ACTIVE) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.CLUB_ID) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.EPROFILE) + ",");
        builder.Append("[PEOPLE]." + nameof(PEOPLE.MOD_DATE) + ",");
        builder.Append("(SELECT COUNT(*) FROM PEOPLE_ACTIONS WHERE PEOPLE_id = PEOPLE.ID) as " + nameof(PEOPLE.RO_ACTIONS) + ", ");
        builder.Append("(SELECT COUNT(*) FROM " + nameof(ANVIZ_ACCESS) + " WHERE " + nameof(ANVIZ_ACCESS.PEOPLE_id) + " = PEOPLE.ID) as " + nameof(PEOPLE.RO_ACCESS) + ", ");
        builder.Append(this.SqlPeople_RO_ERROR());
        builder.Append(" FROM " + nameof(PEOPLE) + " ");
        builder.Append(" INNER JOIN [CLUB] ON [PEOPLE].[CLUB_ID] = [CLUB].[ID] ");
        builder.Append(" WHERE 1=1 ");

        if (this.ISLOCALHOST)
        {
            if (this.DATA?.club != null)
            {
                builder.Append(" AND [PEOPLE].[CLUB_ID] = " + this.DATA?.club);
            }
            else
            {
                builder.Append(" AND [PEOPLE].[CLUB_ID] = 1 ");
            }
        }
        else
        {
            builder.Append(" AND [CLUB].[DOMAIN] = " + SqlString(this.DOMAIN));
        }

        builder.Append(" ORDER BY " + nameof(PEOPLE.MOD_DATE) + " DESC ");

        var res = Dynamic<PEOPLE>(builder);

        if (!string.IsNullOrEmpty(this.DATA?.status?.ToString()))
        {
            if (this.DATA?.status?.ToString() != "VALID")
            {
                res = res.Where(x => (x.RO_ERROR != null) && (x != null) && x.RO_ERROR.Equals(this.DATA?.status?.ToString(), StringComparison.InvariantCultureIgnoreCase))
                    .ToList();
            }
            else
            {
                res = res.Where(x => string.IsNullOrEmpty(x.RO_ERROR))
                    .ToList();
            }
        }

        if (!string.IsNullOrEmpty(this.DATA?.profile?.ToString()))
        {
            res = res.Where(x => (x.EPROFILE != null) && (x != null) && x.EPROFILE.Equals(this.DATA?.profile?.ToString(), StringComparison.InvariantCultureIgnoreCase))
                .ToList();
        }

        if (!string.IsNullOrEmpty(this.DATA?.filter?.ToString()))
        {
            res = res.Where(
                    x => (x.FIRSTNAME != null)
                         && ((x.LASTNAME != null)
                             && (x.FIRSTNAME.StartsWith(this.DATA?.filter?.ToString(), StringComparison.InvariantCultureIgnoreCase)
                                 || x.LASTNAME.StartsWith(this.DATA?.filter?.ToString(), StringComparison.InvariantCultureIgnoreCase))))
                .ToList();
        }

        var isactive = (this.DATA == null) || Convert.ToBoolean((string)this.DATA?.active?.Value);

        if (!string.IsNullOrEmpty(this.DATA?.orderby?.ToString()))
        {
            res = res.OrderBy(
                    this.DATA?.orderby?.ToString() as string
                    + " "
                    + (Convert.ToBoolean(this.DATA?.desc?.ToString() as string)
                           ? "descending"
                           : "ascending"))
                .ToList();
        }

        res = res.Where(x => x.IS_ACTIVE == isactive)
            .ToList();

        return res.Serialize();
    }

    public string DbUserGetByGUID()
    {
        string guid = this.DATA;
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" *, ");
        builder.Append(" DATEADD(MONTH, CAST(" + nameof(PEOPLE.SUBSCRIPTION_MONTHS) + " AS INT), CAST(" + nameof(PEOPLE.SUBSCRIPTION_START) + " AS Datetime)) AS " + nameof(PEOPLE.SUBSCRIPTION_END) + ", ");
        builder.Append(this.SqlPeople_RO_ERROR());
        builder.Append(" FROM " + nameof(PEOPLE) + " ");
        builder.Append(" WHERE GUID = '" + guid + "'");

        return Json(builder);
    }

    public string DbUserGetByID()
    {
        this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        var id = this.DATA?.ID;

        if (id == 0)
        {
            return new List<PEOPLE>
                   {
                       new PEOPLE
                       {
                           IS_ACTIVE  = true,
                           BIRTH_DATE = DateTime.Now,
                           EPROFILE   = EPROFILE.USER.ToString()
                       }
                   }.ToArray()
                .Serialize();
        }

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" *, ");
        builder.Append(" DATEADD(MONTH, CAST(" + nameof(PEOPLE.SUBSCRIPTION_MONTHS) + " AS INT), CAST(" + nameof(PEOPLE.SUBSCRIPTION_START) + " AS Datetime)) AS " + nameof(PEOPLE.SUBSCRIPTION_END) + ", ");
        builder.Append(this.SqlPeople_RO_ERROR());
        builder.Append(" FROM " + nameof(PEOPLE) + " ");
        builder.Append(" WHERE ID = " + id);
        return Json(builder);
    }

    public string DbUserGetCurrent()
    {
        var user = this.CheckLogin(EPROFILE.USER, EPROFILE.PRIVATE, EPROFILE.ADMINISTRATOR, EPROFILE.STAFF, EPROFILE.TRAINER);

        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" * ");
        builder.Append(" FROM " + nameof(PEOPLE) + " ");
        builder.Append(" WHERE ID = " + user.ID);
        return Json(builder);
    }

    public string DbUserGetMin()
    {
        return Json(
            new Orm()
                .Select("[PEOPLE].[ID]")
                .Select("{fn CONCAT([PEOPLE].LASTNAME, {fn CONCAT(' ', [PEOPLE].FIRSTNAME)}) } AS [NAME]")
                .Where("[PEOPLE].[IS_ACTIVE] = 1 AND [CLUB].[DOMAIN] = " + SqlString(this.DOMAIN))
                .OrderBy("[PEOPLE].[LASTNAME]")
                .From(nameof(PEOPLE))
                .Join(nameof(CLUB))
                .On("[CLUB].[ID] = [PEOPLE].[CLUB_ID]")
                .Build()
        );
    }

    public string DbUserLogin()
    {
        string username = this.DATA?.username;
        string password = this.DATA?.password;

        var res = new PageApi().DbLogin(username, password);
        var guid = res?.GUID;

        this.WriteLoginCookies(guid);

        return res.Serialize();
    }

    public string DbUsersAutoRegister()
    {
        var db_data = ((object)this.DATA).ToString()
            .Deserialize<PEOPLE>();

        db_data.GUID = Guid.NewGuid()
            .ToString();

        db_data.BIRTH_DATE = DateTime.Now;

        db_data.EPROFILE = EPROFILE.PRIVATE.ToString();

        db_data.IS_ACTIVE = true;

        Execute(
            DbAutoSave(
                db_data,
                nameof(PEOPLE.FIRSTNAME),
                nameof(PEOPLE.LASTNAME),
                nameof(PEOPLE.PHONE_NUMBER),
                nameof(PEOPLE.CLUB_ID),
                nameof(PEOPLE.EPROFILE),
                nameof(PEOPLE.BIRTH_DATE),
                nameof(PEOPLE.IS_ACTIVE),
                nameof(PEOPLE.GUID),
                nameof(PEOPLE.EMAIL),
                nameof(PEOPLE.PASSWORD)
            )
        );

        this.DbLogin(db_data.GUID);
        this.WriteLoginCookies(db_data.GUID);

        try
        {
            Mail.SendMail(
                db_data.EMAIL, File.ReadAllText(
                        HttpContext.Current.Server.MapPath("/Mail/welcome.txt")
                    )
                    .ReplaceAll(db_data), "Benvenuto in "
                                          + "KYMERA.cloud");
        }
        catch (Exception e) { }

        return 1.Serialize();
    }

    public string DbUsersAutoRegisterCrossfit()
    {
        var db_data = ((object)this.DATA).ToString()
            .Deserialize<PEOPLE>();

        db_data.GUID = Guid.NewGuid()
            .ToString();

        var old_people = Dynamic<COURSE_DATA>(
                new Orm()
                    .Select()
                    .From(nameof(PEOPLE))
                    .Where("[PEOPLE].[FIRSTNAME] = '" + db_data.FIRSTNAME.Trim() + "' AND [PEOPLE].[LASTNAME] = '" + db_data.LASTNAME.Trim() + "'")
                    .Build())
            .SingleOrDefault();

        if (old_people != null)
        {
            this.WelcomeMessage(old_people.ID);
            throw new Exception("Attenzione! Risulti essere già iscritto in KYMERA, per tanto non necessiti della registrazione.\nLe tue credenziali di accesso sono state inviate alla mail associata al tuo account\nGrazie.");
        }

        db_data.EPROFILE = EPROFILE.PRIVATE.ToString();
        db_data.IS_ACTIVE = true;
        db_data.CLUB_ID = 1;
        db_data.ESUBSCRIPTIONTYPE = ESUBSCRIPTIONTYPE.CROSSFIT.ToString();

        Execute(
            DbAutoSave(
                db_data,
                nameof(PEOPLE.FIRSTNAME),
                nameof(PEOPLE.LASTNAME),
                nameof(PEOPLE.ESUBSCRIPTIONTYPE),
                nameof(PEOPLE.PHONE_NUMBER),
                nameof(PEOPLE.CLUB_ID),
                nameof(PEOPLE.EPROFILE),
                nameof(PEOPLE.BIRTH_DATE),
                nameof(PEOPLE.IS_ACTIVE),
                nameof(PEOPLE.GUID),
                nameof(PEOPLE.EMAIL),
                nameof(PEOPLE.PASSWORD)
            )
        );

        this.DbLogin(db_data.GUID);
        this.WriteLoginCookies(db_data.GUID);

        try
        {
            Mail.SendMail(
                db_data.EMAIL, File.ReadAllText(
                        HttpContext.Current.Server.MapPath("/Mail/welcome_crossfit.txt")
                    )
                    .ReplaceAll(db_data), "Benvenuto in "
                                          + "KYMERA.cloud");
        }
        catch (Exception e) { }

        return 1.Serialize();
    }

    public string DbUserSave()
    {
        var check_login = this.CheckLogin(EPROFILE.ADMINISTRATOR, EPROFILE.STAFF);

        var serialize_data = ((object)this.DATA).ToString()
            .Deserialize<PEOPLE>();

        var current_db = Dynamic<PEOPLE>(
                new Orm()
                    .Select("[PEOPLE].[EMAIL]")
                    .From("[PEOPLE]")
                    .Where("[PEOPLE].[ID] = " + SqlInt(serialize_data.ID))
                    .Build()
            )
            .FirstOrDefault();

        if (serialize_data.ID == 0)
        {
            serialize_data.GUID = Guid.NewGuid()
                .ToString();
            serialize_data.IS_ACTIVE = true;
            serialize_data.CLUB_ID = check_login.CLUB_ID;

            Execute(
                DbAutoSave(
                    serialize_data,
                    nameof(PEOPLE.GUID),
                    nameof(PEOPLE.FIRSTNAME),
                    nameof(PEOPLE.LASTNAME),
                    nameof(PEOPLE.EMAIL),
                    nameof(PEOPLE.EGENDER),
                    nameof(PEOPLE.CLUB_ID),
                    nameof(PEOPLE.EPROFILE),
                    nameof(PEOPLE.PASSWORD),
                    nameof(PEOPLE.PHONE_NUMBER),
                    nameof(PEOPLE.PROFILE_PIC),
                    nameof(PEOPLE.IS_ACTIVE),
                    nameof(PEOPLE.NOTES),
                    nameof(PEOPLE.BIRTH_DATE)));
        }
        else
        {
            Execute(
                DbAutoSave(
                    serialize_data,
                    nameof(PEOPLE.FIRSTNAME),
                    nameof(PEOPLE.LASTNAME),
                    nameof(PEOPLE.EMAIL),
                    nameof(PEOPLE.EGENDER),
                    nameof(PEOPLE.EPROFILE),
                    nameof(PEOPLE.PASSWORD),
                    nameof(PEOPLE.PHONE_NUMBER),
                    nameof(PEOPLE.PROFILE_PIC),
                    nameof(PEOPLE.ESUBSCRIPTIONTYPE),
                    nameof(PEOPLE.EFASCIAORARIA),
                    nameof(PEOPLE.SUBSCRIPTION_NUM),
                    nameof(PEOPLE.SUBSCRIPTION_MONTHS),
                    nameof(PEOPLE.MEMBERSHIP_START),
                    nameof(PEOPLE.ACCESSES_CROSSFIT),
                    nameof(PEOPLE.ACCESSES_COURSE),
                    nameof(PEOPLE.SUBSCRIPTION_START),
                    nameof(PEOPLE.IS_ACTIVE),
                    nameof(PEOPLE.MEDICAL_CHECK),
                    nameof(PEOPLE.CLUB_ID),
                    nameof(PEOPLE.NOTES),
                    nameof(PEOPLE.TRAINER_ID),
                    nameof(PEOPLE.CARD_ID),
                    nameof(PEOPLE.BIRTH_DATE)));
        }

        if ((current_db == null) || (current_db?.EMAIL != serialize_data.EMAIL))
        {
            try
            {
                Mail.SendMail(
                    serialize_data?.EMAIL, File.ReadAllText(
                            HttpContext.Current.Server.MapPath("/Mail/welcome.txt")
                        )
                        .ReplaceAll(serialize_data), "Benvenuto in KYMERA.cloud");
            }
            catch (Exception e) { }
        }

        return 1.Serialize();
    }

    public string DbUserSaveProfilePic()
    {
        var db_data = ((object)this.DATA).ToString()
            .Deserialize<PEOPLE>();

        return Execute(
            DbAutoSave(
                db_data,
                nameof(PEOPLE.PROFILE_PIC)
            ));
    }

    public string DbUsersMin()
    {
        var builder = new StringBuilder();
        builder.Append(" SELECT ");
        builder.Append(" ID, ");
        builder.Append(" {fn CONCAT(PEOPLE.LASTNAME, {fn CONCAT(' ', PEOPLE.FIRSTNAME)}) } AS NAME ");
        builder.Append(" FROM PEOPLE ");
        builder.Append(" WHERE " + nameof(PEOPLE.EPROFILE) + " = '" + EPROFILE.USER + "' ");
        builder.Append(" OR " + nameof(PEOPLE.EPROFILE) + " = '" + EPROFILE.PRIVATE + "' ");
        builder.Append(" ORDER BY LASTNAME ");
        return Json(builder);
    }

    public string DbWelcomeMessage()
    {
        return WelcomeMessage(this.DATA.ID);
    }

    public string DbWelcomeMessageAll()
    {
        var query_people = new StringBuilder();
        query_people.Append(" SELECT * FROM PEOPLE WHERE IS_ACTIVE = 1 AND CLUB_ID = " + this.DATA.ID + " AND IS_EMAIL_OK = 0");
        var people = Dynamic<PEOPLE>(query_people)
            .ToList();

        var query_club = new StringBuilder();
        query_club.Append(" SELECT * FROM CLUB WHERE ID = " + this.DATA.ID);
        var club = Dynamic<CLUB>(query_club)
            .FirstOrDefault();

        people.ForEach(
            people1 =>
            {
                try
                {
                    if (club?.ID > 0)
                    {
                        Mail.SendMail(
                            people1.EMAIL, File.ReadAllText(
                                    HttpContext.Current.Server.MapPath("/Mail/welcome_club.txt")
                                )
                                .ReplaceAll(people1, club), "Benvenuto in "
                                                            + (club?.NAME ?? "KYMERA.cloud"));
                    }
                    else
                    {
                        Mail.SendMail(
                            people1.EMAIL, File.ReadAllText(
                                    HttpContext.Current.Server.MapPath("/Mail/welcome.txt")
                                )
                                .ReplaceAll(people1, club), "Benvenuto in "
                                                            + (club?.NAME ?? "KYMERA.cloud"));
                    }

                    var query_update = new StringBuilder();
                    query_update.Append(" UPDATE PEOPLE SET IS_EMAIL_OK = 1 WHERE ID = " + people1?.ID);
                    Json(query_update);
                }
                catch (Exception e) { }
            });

        return 1.ToString();
    }

    public string PdfGet()
    {

        string p_cliente = DATA?.cliente;
        string p_utente = DATA?.utente;
        string p_filter = DATA?.filter;
        string p_date_start = DATA?.date_start;
        string p_date_end = DATA?.date_end;

        var baseUrl = this.Request.Url.Scheme + "://" + this.Request.Url.Authority + this.Request.ApplicationPath.TrimEnd('/') + "/";

        var downloads_aaaa_pdf = "/Downloads/" + Guid.NewGuid() + ".pdf";
        Codaxy.WkHtmlToPdf.PdfConvert.ConvertHtmlToPdf(baseUrl + "/Pdf.aspx?" +
            "p_cliente=" + p_cliente + "&" +
            "p_utente=" + p_utente + "&" +
            "p_filter=" + p_filter + "&" +
            "p_date_start=" + p_date_start + "&" +
            "p_date_end=" + p_date_end, HttpContext.Current.Server.MapPath(downloads_aaaa_pdf));
        return downloads_aaaa_pdf;
    }

    public StringBuilder SqlPeople_RO_ERROR()
    {
        var builder = new StringBuilder();
        builder.Append(
            " (SELECT TOP 1 "
            + "CASE "
            + "WHEN(PA.IS_DONE = 0) AND DATEDIFF(DAY, CAST(PA.DATE AS        Datetime), CAST(SYSDATETIME() AS Datetime)) > 0 THEN 'EXPIRED_PAYMENTS' "
            + "WHEN                                                          SUBSCRIPTION_START = NULL THEN 'SUBSCRIPTION_MISSING' "
            + "WHEN DATEDIFF(DAY, DATEADD(MONTH, CAST(SUBSCRIPTION_MONTHS AS INT), CAST(SUBSCRIPTION_START AS Datetime)), CAST(SYSDATETIME() AS VARCHAR)) > 0 THEN 'SUBSCRIPTION_EXPIRED' "
            + "WHEN                                                          MEMBERSHIP_START = NULL THEN 'MEMBERSHIP_MISSING' "
            + "WHEN DATEDIFF(DAY, DATEADD(YEAR, 1, CAST(MEMBERSHIP_START AS  Datetime)), CAST(SYSDATETIME() AS Datetime)) > 0 THEN 'MEMBERSHIP_EXPIRED' "
            + "WHEN                                                          MEDICAL_CHECK = NULL THEN 'MEDICAL_CHECK_MISSING' "
            + "WHEN DATEDIFF(DAY, DATEADD(YEAR, 1, CAST(MEDICAL_CHECK AS     Datetime)), CAST(SYSDATETIME() AS Datetime)) > 0 THEN 'MEDICAL_CHECK_EXPIRED' "
            + "ELSE NULL "
            + "END AS RO_ERROR "
            + "FROM [PEOPLE] AS P LEFT OUTER JOIN [PEOPLE_ACTIONS] AS PA ON P.ID = PA.PEOPLE_ID "
            + "WHERE P.ID = PEOPLE.ID "
            + " "
            + "ORDER BY RO_ERROR DESC "
            + ") AS RO_ERROR "
            + string.Empty);
        return builder;
    }

    public DateTime UtilGetDate(COURSE_DATA x)
    {
        return this.UtilGetDateWithWeek(
            x,
            int.MinValue);
    }

    public DateTime UtilGetDateWithWeek(COURSE_DATA x,
                                        int w)
    {
        var time = TimeSpan.ParseExact(
            x.STIME,
            "g",
            new CultureInfo("en"));
        return Helper.GetDateFromWeekNumberAndDayOfWeek(
                w != int.MinValue
                    ? w
                    : x.WEEK.Value,
                (int)x.DAY.ToEnum<EWEEKDAY>()
                    .ToDayOfWeek()
                - 1)
            .Add(time);
    }

    public string WelcomeMessage(object people_id)
    {
        var query_people = new StringBuilder();
        query_people.Append(" SELECT * FROM PEOPLE WHERE ID = " + people_id);
        var people = Dynamic<PEOPLE>(query_people)
            .FirstOrDefault();

        var query_club = new StringBuilder();
        query_club.Append(" SELECT * FROM CLUB WHERE ID = " + people?.CLUB_ID);
        var club = Dynamic<CLUB>(query_club)
            .FirstOrDefault();

        var query_update = new StringBuilder();
        query_update.Append(" UPDATE PEOPLE SET IS_EMAIL_OK = 1 WHERE ID = " + people?.ID);
        Json(query_update);

        if (club?.ID > 0)
        {
            Mail.SendMail(
                people.EMAIL, File.ReadAllText(
                        HttpContext.Current.Server.MapPath("/Mail/welcome_club.txt")
                    )
                    .ReplaceAll(people, club), "Benvenuto in "
                                               + (club?.NAME ?? "KYMERA.cloud"));
        }
        else
        {
            Mail.SendMail(
                people.EMAIL, File.ReadAllText(
                        HttpContext.Current.Server.MapPath("/Mail/welcome.txt")
                    )
                    .ReplaceAll(people, club), "Benvenuto in "
                                               + (club?.NAME ?? "KYMERA.cloud"));
        }

        return 1.ToString();
    }

    private static void DbBookCondition(COURSE course,
                                        PEOPLE people)
    {
        if (IsCrossfit(course) && !DbCanBookCrossfit(people))
        {
            if (people.ACCESSES_CROSSFIT <= 0)
            {
                throw new Exception("non hai abbastanza INGRESSI (CROSSFIT) per poter prenotare questo corso, effettua la ricarica!");
            }
        }

        if (IsCorsi(course) && !DbCanBookCorsi(people))
        {
            if (people.ACCESSES_COURSE <= 0)
            {
                throw new Exception("non hai abbastanza INGRESSI (CORSI) per poter prenotare questo corso, effettua la ricarica!");
            }
        }
    }

    private static bool DbCanBookCorsi(PEOPLE people)
    {
        return (people.ESUBSCRIPTIONTYPE == ESUBSCRIPTIONTYPE.CORSI.ToString()) || (people.ESUBSCRIPTIONTYPE == ESUBSCRIPTIONTYPE.OPEN_WELLNESS.ToString());
    }

    private static bool DbCanBookCrossfit(PEOPLE people)
    {
        return (people.ESUBSCRIPTIONTYPE == ESUBSCRIPTIONTYPE.CROSSFIT.ToString()) || (people.ESUBSCRIPTIONTYPE == ESUBSCRIPTIONTYPE.OPEN_POWER.ToString());
    }

    private static bool IsCorsi(COURSE course)
    {
        return !course.NAME.ToUpper()
                   .Contains("CROSSFIT");
    }

    private static bool IsCrossfit(COURSE course)
    {
        return course.NAME.ToUpper()
            .Contains("CROSSFIT");
    }

    private static string SqlCourseDate()
    {
        return " DATEADD (WEEK, CDP.WEEK, DATEADD (YEAR, "
               + DateTime.Now.Year
               + "-1900"
               + ", 0)) - 4 - DATEPART(DW, DATEADD (WEEK, CDP.WEEK, DATEADD (YEAR, "
               + DateTime.Now.Year
               + "-1900, 0)) - 4) + CASE CD.DAY "
               + "WHEN 'MONDAY' THEN 2 "
               + "WHEN 'TUESDAY' THEN 3 "
               + "WHEN 'WEDNESDAY' THEN 4 "
               + "WHEN 'THURSDAY' THEN 5 "
               + "WHEN 'FRIDAY' THEN 6 "
               + "WHEN 'SATURDAY' THEN 7 "
               + "END + CAST(CD.STIME As Time) ";
    }
}