using System;
namespace Model { 

public partial class PEOPLE
{
    public int ID { get; set; }

    public string EMAIL { get; set; }

    public string PASSWORD { get; set; }

    public string FIRSTNAME { get; set; }

    public string SUBSCRIPTION_NUM { get; set; }

    public string PHONE_NUMBER { get; set; }

    public string LASTNAME { get; set; }

    public DateTime BIRTH_DATE { get; set; }

    public int? RATING { get; set; }

    public string EPROFILE { get; set; }

    public string NAME { get; set; }

    public string EGENDER { get; set; }

    public string FISCAL_CODE { get; set; }

    public float? HEIGHT { get; set; }

    public float? WEIGHT { get; set; }

    public DateTime? MEDICAL_CHECK { get; set; }

    public string NOTES { get; set; }

    public bool PAYMENT_OK { get; set; }

    public DateTime? FIRST_PAYMENT { get; set; }

    public DateTime? SECOND_PAYMENT { get; set; }

    public string PROFILE_PIC { get; set; }

    public DateTime? SUBSCRIPTION { get; set; }

    public int? SUBSCRIPTION_MONTHS { get; set; }

    public DateTime? SUBSCRIPTION_END { get; set; }

    public int? SUBSCRIPTION_POINTS { get; set; }

    public int ACCESSES_CROSSFIT { get; set; }

    public int ACCESSES_COURSE { get; set; }

    public DateTime? SUBSCRIPTION_START { get; set; }

    public string TO_PAY { get; set; }

    public string GUID { get; set; }

    public DateTime INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public int? SUBSCRIPTION_TYPE_id { get; set; }

    public string CODE { get; set; }

    public float? DEPOSIT { get; set; }

    public float? FIRST_PAYMENT_AMOUNT { get; set; }

    public float? SECOND_PAYMENT_AMOUNT { get; set; }

    public string JSON_PEOPLE_ITEM { get; set; }

    public DateTime? CARD_START { get; set; }

    public DateTime? CARD_END { get; set; }

    public string ELANGUAGE { get; set; }

    public int? TRAINER_DATA_id { get; set; }

    public string ENOTIFICATION { get; set; }

    public DateTime? SUBSCRIPTION_EXPIRE_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public string DISPLAY { get; set; }

    public int? AC_ID { get; set; }

    public int? NOTIFICATIONS { get; set; }

    public DateTime? LAST_ACCESS { get; set; }

    public DateTime? LAST_NOTIFICATION { get; set; }

    public bool IS_ACTIVE { get; set; }

    public bool IS_WEEKEND { get; set; }

    public string ESUBSCRIPTIONTYPE { get; set; }

    public bool MAIL_CHECK { get; set; }

    public bool HAS_PAYMENTS { get; set; }

    public bool PHONE_CHECK { get; set; }

    public DateTime? MEMBERSHIP_START { get; set; }

    public DateTime? MEMBERSHIP_END { get; set; }

    public bool IS_SMS_OK { get; set; }

    public string EGROUP { get; set; }

    public string PDF_CARD { get; set; }

    public int? CLUB_ID { get; set; }

    public string RO_ERROR { get; set; }

    public bool IS_EMAIL_OK { get; set; }

    public int? TRAINER_ID { get; set; }

    public int? CARD_ID { get; set; }

    public string EFASCIAORARIA { get; set; }

} 

public partial class ANVIZ_ACCESS
{
    public int ID { get; set; }

    public DateTime? TIME { get; set; }

    public string DISPLAY { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public string NAME { get; set; }

    public int? INS_USER_ID { get; set; }

    public int? PEOPLE_id { get; set; }

    public bool IS_NOTIFY { get; set; }

    public bool NOTIFY { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class COURSE_DATA
{
    public int ID { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public string NAME { get; set; }

    public int? INS_USER_ID { get; set; }

    public int? COURSE_id { get; set; }

    public bool IS_ACTIVE { get; set; }

    public string DAY { get; set; }

    public int? TRAINER_id { get; set; }

    public int? PLACES { get; set; }

    public string STIME { get; set; }

    public int? CREDITS { get; set; }

    public bool SUSPENDED { get; set; }

    public bool STARTED { get; set; }

    public DateTime? DATE { get; set; }

    public int? WEEK { get; set; }

    public int? CLUB_ID { get; set; }

} 

public partial class PEOPLE_ACTIONS
{
    public int ID { get; set; }

    public string EACTION { get; set; }

    public float? VDOUBLE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public string NAME { get; set; }

    public int? INS_USER_ID { get; set; }

    public int? PEOPLE_id { get; set; }

    public string DISPLAY { get; set; }

    public DateTime? DATE { get; set; }

    public bool IS_DONE { get; set; }

    public bool IS_ACTIVE { get; set; }

    public string ESUBSCRIPTIONTYPE { get; set; }

} 

public partial class COURSE_DATA_STATUS
{
    public int ID { get; set; }

    public int? WEEK { get; set; }

    public string ECOURSESTATUS { get; set; }

    public string NAME { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

    public int? COURSE_DATA_id { get; set; }

} 

public partial class COURSE_DATA_PEOPLE
{
    public int ID { get; set; }

    public string DISPLAY { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public string NAME { get; set; }

    public int? INS_USER_ID { get; set; }

    public int? COURSE_DATA_id { get; set; }

    public int? PEOPLE_id { get; set; }

    public bool IS_ACTIVE { get; set; }

    public int? WEEK { get; set; }

    public DateTime? COURSE_DATE { get; set; }

} 

public partial class COURSE
{
    public int ID { get; set; }

    public string NAME { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public string DISPLAY { get; set; }

    public int? COURSE_MAX { get; set; }

    public int? PEOPLE_id { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class LOCALIZATION
{
    public int ID { get; set; }

    public string K { get; set; }

    public string ENGLISH { get; set; }

    public string ITALIANO { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public string NAME { get; set; }

    public int? INS_USER_ID { get; set; }

    public string DISPLAY { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class CLUB
{
    public int ID { get; set; }

    public string NAME { get; set; }

    public string ADDRESS { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public string DOMAIN { get; set; }

    public bool IS_ADMIN { get; set; }

} 

public partial class PEOPLE_PT
{
    public int ID { get; set; }

    public int PEOPLE_ID { get; set; }

    public DateTime MOD_DATE { get; set; }

    public DateTime INS_DATE { get; set; }

    public string PATENT { get; set; }

    public string ADDRESS { get; set; }

    public string AREA { get; set; }

} 

public partial class EXERCISE
{
    public int ID { get; set; }

    public string NAME { get; set; }

    public string EMUSCLE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

    public string URL { get; set; }

} 

public partial class CARD
{
    public int ID { get; set; }

    public string NAME { get; set; }

    public int? TRAINER_ID { get; set; }

    public DateTime INS_DATE { get; set; }

    public DateTime MOD_DATE { get; set; }

    public int? DURATION { get; set; }

    public int? MOD_USER_ID { get; set; }

    public string DESC { get; set; }

    public string LEVEL { get; set; }

    public int FREQ { get; set; }

} 

public partial class CARD_DETAILS
{
    public int ID { get; set; }

    public DateTime INS_DATE { get; set; }

    public DateTime MOD_DATE { get; set; }

    public int CARD_ID { get; set; }

    public int EXERCISE_ID { get; set; }

    public int ORDER { get; set; }

    public int REPS { get; set; }

    public int SETS { get; set; }

    public string METHOD { get; set; }

    public int REST { get; set; }

    public string GROUP { get; set; }

    public string NOTE { get; set; }

} 

public partial class SECURITY
{
    public int ID { get; set; }

    public string IP { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

} 

public partial class SCADENZE
{
    public int ID { get; set; }

    public string NAME { get; set; }

    public int REC { get; set; }

    public DateTime? DATE { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class SCADENZE_CLIENTI
{
    public int ID { get; set; }

    public int? SCADENZA_ID { get; set; }

    public int? CLIENTE_ID { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class SCADENZE_UTENTI
{
    public int ID { get; set; }

    public int? SCADENZA_ID { get; set; }

    public int? UTENTE_ID { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class CLIENTI
{
    public int ID { get; set; }

    public string NAME { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

} 

public partial class UTENTI
{
    public int ID { get; set; }

    public string EMAIL { get; set; }

    public string NOME { get; set; }

    public string COGNOME { get; set; }

    public DateTime? MOD_DATE { get; set; }

    public DateTime? INS_DATE { get; set; }

    public int? INS_USER_ID { get; set; }

    public bool IS_ACTIVE { get; set; }

}}