using Riwayatek.Application.Common.DTOs;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Application.Common.Mappings;

public static class MappingProfile
{
    public static UserDto ToDto(this User user) =>
        new(user.Id, user.Name, user.Email, user.Phone, user.Role, user.CreatedAt);

    public static OrderResponse ToDto(this Order order)
    {
        var hobbies = string.IsNullOrEmpty(order.Hobbies) ? new List<string>() : order.Hobbies.Split(',').ToList();
        var qualities = string.IsNullOrEmpty(order.Qualities) ? new List<string>() : order.Qualities.Split(',').ToList();
        var memories = string.IsNullOrEmpty(order.Memories) ? new List<string>() : order.Memories.Split(',').ToList();
        var images = string.IsNullOrEmpty(order.Images) ? new List<string>() : order.Images.Split(',').ToList();
        var characterImages = string.IsNullOrEmpty(order.CharacterImages) ? new List<string>() : order.CharacterImages.Split(',').ToList();

        return new OrderResponse(
            order.Id,
            order.OrderNumber,
            order.BookType?.NameAr ?? "",
            order.Status,
            order.TotalAmount,
            order.TransactionNumber,
            order.PaymentProofUrl,
            order.RejectionReason,
            order.CreatedAt,
            order.UpdatedAt,
            new OrderDetailDto(
                order.CharacterName,
                order.Age,
                order.Nationality,
                hobbies,
                qualities,
                memories,
                order.StoryType,
                order.StoryGoal,
                order.ClientMessage,
                images,
                order.EyeColor,
                order.HairColor,
                order.Height,
                order.SkinTone,
                order.Build,
                characterImages,
                new ShippingAddressDto(
                    order.ShippingFullName,
                    order.ShippingPhone,
                    order.ShippingCity,
                    order.ShippingDistrict,
                    order.ShippingStreet,
                    order.ShippingBuildingNumber,
                    order.ShippingAdditionalDetails
                ),
                order.Timeline.Select(t => new TimelineDto(t.Status, t.Date, t.Note)).ToList()
            )
        );
    }
}
