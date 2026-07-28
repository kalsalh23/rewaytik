namespace Riwayatek.Application.Common.DTOs;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Phone, string Password, string ConfirmPassword);
public record AuthResponse(string Token, UserDto User);
public record UserDto(Guid Id, string Name, string Email, string Phone, string Role, DateTime CreatedAt);

public record CreateOrderRequest(
    Guid BookTypeId,
    string CharacterName,
    int? Age,
    string Nationality,
    List<string> Hobbies,
    List<string> Qualities,
    List<string> Memories,
    string StoryType,
    string StoryGoal,
    string ClientMessage,
    ShippingAddressDto ShippingAddress,
    List<string>? Images,
    string? EyeColor,
    string? HairColor,
    string? Height,
    string? SkinTone,
    string? Build,
    List<string>? CharacterImages
);

public record ShippingAddressDto(
    string FullName,
    string Phone,
    string City,
    string District,
    string Street,
    string BuildingNumber,
    string? AdditionalDetails
);

public record OrderResponse(
    Guid Id,
    string OrderNumber,
    string BookTypeName,
    string Status,
    decimal TotalAmount,
    string? TransactionNumber,
    string? PaymentProofUrl,
    string? RejectionReason,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    OrderDetailDto? Detail
);

public record OrderDetailDto(
    string CharacterName,
    int? Age,
    string Nationality,
    List<string> Hobbies,
    List<string> Qualities,
    List<string> Memories,
    string StoryType,
    string StoryGoal,
    string ClientMessage,
    List<string> Images,
    string? EyeColor,
    string? HairColor,
    string? Height,
    string? SkinTone,
    string? Build,
    List<string> CharacterImages,
    ShippingAddressDto ShippingAddress,
    List<TimelineDto> Timeline
);

public record TimelineDto(string Status, DateTime Date, string? Note);

public record ContactRequest(string Name, string Email, string? Phone, string Subject, string Message);
public record TransactionRequest(string TransactionNumber);
public record ApiResponse<T>(bool Success, T? Data, string? Message, List<string>? Errors = null);
