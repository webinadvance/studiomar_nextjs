using System;
namespace Bridge
{
    public class Emit
    {
        public const object StringNameUpperCase = null;
    }

    public class EnumAttribute : Attribute
    {
        public EnumAttribute(object stringNameUpperCase) { }
    }
}