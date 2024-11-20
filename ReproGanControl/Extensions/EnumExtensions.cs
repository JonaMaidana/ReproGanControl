using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace ReproGanControl.Extensions 
{
    public static class EnumExtensions
    {
        // Método de extensión para obtener el Display Name
        public static string GetDisplayName(this Enum enumValue)
        {
            return enumValue.GetType()
                            .GetMember(enumValue.ToString())
                            .First()
                            .GetCustomAttribute<DisplayAttribute>()?.Name
                   ?? enumValue.ToString();
        }
    }
}