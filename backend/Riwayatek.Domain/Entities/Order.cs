namespace Riwayatek.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid BookTypeId { get; set; }
    public BookType BookType { get; set; } = null!;

    public string Status { get; set; } = "pending_payment";
    public decimal TotalAmount { get; set; }

    public string CharacterName { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string Nationality { get; set; } = string.Empty;
    public string Hobbies { get; set; } = string.Empty;
    public string Qualities { get; set; } = string.Empty;
    public string Memories { get; set; } = string.Empty;
    public string StoryType { get; set; } = string.Empty;
    public string StoryGoal { get; set; } = string.Empty;
    public string ClientMessage { get; set; } = string.Empty;
    public string Images { get; set; } = string.Empty;
    public string? EyeColor { get; set; }
    public string? HairColor { get; set; }
    public string? Height { get; set; }
    public string? SkinTone { get; set; }
    public string? Build { get; set; }
    public string CharacterImages { get; set; } = string.Empty;

    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingDistrict { get; set; } = string.Empty;
    public string ShippingStreet { get; set; } = string.Empty;
    public string ShippingBuildingNumber { get; set; } = string.Empty;
    public string? ShippingAdditionalDetails { get; set; }

    public string? TransactionNumber { get; set; }
    public string? PaymentProofUrl { get; set; }
    public string? RejectionReason { get; set; }

    public bool IsArchived { get; set; } = false;
    public DateTime? ArchivedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<OrderTimeline> Timeline { get; set; } = new List<OrderTimeline>();
}
