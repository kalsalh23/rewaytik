namespace Riwayatek.Infrastructure.Services;

public class OrderNumberGenerator
{
    private static readonly Random _random = new();

    public static string Generate()
    {
        var datePart = DateTime.UtcNow.ToString("yyMMdd");
        var randomPart = _random.Next(1000, 9999).ToString();
        return $"RWK-{datePart}-{randomPart}";
    }
}
