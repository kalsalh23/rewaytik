namespace Riwayatek.Domain.Entities;

public class OrderTimeline
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public string Status { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Note { get; set; }
}
