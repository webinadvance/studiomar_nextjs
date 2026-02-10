using System;
using System.Collections.Generic;
namespace Model
{
    public partial class PEOPLE
    {
        public int? RO_ACCESS { get; set; }

        public int? RO_ACTIONS { get; set; }

        public List<string> TEST { get; set; }
    }

    public partial class SCADENZE
    {
        public int RO_UTENTE_ID { get; set; }

        public int RO_CLIENTE_ID { get; set; }

        public string RO_UTENTI { get; set; }

        public string RO_CLIENTI { get; set; }

        public DateTime RO_SCADENZA_REALE { get; set; }
    }

    public partial class ANVIZ_ACCESS
    {
        public string RO_PROFILE_PIC { get; set; }

        public string RO_ERROR { get; set; }

        public string RO_PEOPLE_NAME { get; set; }
    }

    public partial class COURSE_DATA
    {
        public string RO_CLUB_ADDRSS { get; set; }

        public string RO_CLUB_DSTNC { get; set; }

        public string RO_CLUB_NAME { get; set; }

        public int? RO_COURSE_DATA_PEOPLE_ID { get; set; }

        public string RO_COURSE_NAME { get; set; }

        public int RO_FREE_PLACES { get; set; }

        public int? RO_MY_BOOKING { get; set; }

        public string RO_STATUS { get; set; }

        public string RO_TRAINER_NAME { get; set; }
    }

    public partial class CLUB
    {
        public int RO_AFFILIEATES { get; set; }
    }

    public partial class PEOPLE_PT
    {
        public string RO_PHONE_NUMBER { get; set; }

        public string RO_MAIL { get; set; }

        public string RO_PT_NAME { get; set; }

        public string RO_PROFILE_PIC { get; set; }

        public int RO_CARDS { get; set; }

        public string RO_DIST { get; set; }
    }

    public partial class CARD
    {
        public string RO_PT_NAME { get; set; }

        public string RO_PATENT { get; set; }
    }

    public partial class CARD_DETAILS
    {
        public string RO_EXERCISE_NAME { get; set; }

        public string RO_EXERCISE_URL { get; set; }
    }
}