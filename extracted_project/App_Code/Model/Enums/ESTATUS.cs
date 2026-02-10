using Bridge;
namespace Model.Enums
{
    [Enum(Emit.StringNameUpperCase)]
    public enum ESTATUS
    {
        EXPIRED_PAYMENTS,

        SUBSCRIPTION_EXPIRED,

        MEMBERSHIP_EXPIRED,

        MEMBERSHIP_MISSING,

        MEDICAL_CHECK_MISSING,

        MEDICAL_CHECK_EXPIRED
    }
}