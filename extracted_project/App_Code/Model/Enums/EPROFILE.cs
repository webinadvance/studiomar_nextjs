using Bridge;
namespace Model.Enums
{
    [Enum(Emit.StringNameUpperCase)]
    public enum EPROFILE
    {
        PUBLIC,

        ADMINISTRATOR,

        PRIVATE,

        GUEST,

        STAFF,

        TRAINER,

        USER,

        TABLET
    }
}