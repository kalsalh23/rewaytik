using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.DTOs;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Application.Common.Mappings;
using Riwayatek.Domain.Entities;
using Riwayatek.Infrastructure.Services;
using System.Security.Claims;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IHubContext<RiwayatekHub> _hubContext;

    public OrdersController(IApplicationDbContext context, IHubContext<RiwayatekHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> CreateOrder(CreateOrderRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var bookType = await _context.BookTypes.FindAsync(request.BookTypeId);
        if (bookType == null)
            return BadRequest(new ApiResponse<OrderResponse>(false, null, "نوع الكتاب غير موجود"));

        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderNumber = OrderNumberGenerator.Generate(),
            UserId = userId,
            BookTypeId = request.BookTypeId,
            Status = "pending_payment",
            TotalAmount = bookType.Price,
            CharacterName = request.CharacterName,
            Age = request.Age,
            Nationality = request.Nationality,
            Hobbies = string.Join(",", request.Hobbies),
            Qualities = string.Join(",", request.Qualities),
            Memories = string.Join(",", request.Memories),
            StoryType = request.StoryType,
            StoryGoal = request.StoryGoal,
            ClientMessage = request.ClientMessage,
            Images = request.Images != null ? string.Join(",", request.Images) : null!,
            EyeColor = request.EyeColor,
            HairColor = request.HairColor,
            Height = request.Height,
            SkinTone = request.SkinTone,
            Build = request.Build,
            CharacterImages = request.CharacterImages != null ? string.Join(",", request.CharacterImages) : "",
            ShippingFullName = request.ShippingAddress.FullName,
            ShippingPhone = request.ShippingAddress.Phone,
            ShippingCity = request.ShippingAddress.City,
            ShippingDistrict = request.ShippingAddress.District,
            ShippingStreet = request.ShippingAddress.Street,
            ShippingBuildingNumber = request.ShippingAddress.BuildingNumber,
            ShippingAdditionalDetails = request.ShippingAddress.AdditionalDetails,
            CreatedAt = DateTime.UtcNow
        };

        order.Timeline.Add(new OrderTimeline
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Status = "pending_payment",
            Date = DateTime.UtcNow,
            Note = "تم إنشاء الطلب"
        });

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<OrderResponse>(true, order.ToDto(), "تم إنشاء الطلب بنجاح"));
    }

    [Authorize]
    [HttpGet("my-orders")]
    public async Task<ActionResult<ApiResponse<List<OrderResponse>>>> GetMyOrders([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var isAdmin = User.IsInRole("admin");
        var query = _context.Orders.Include(o => o.BookType).AsQueryable();

        if (isAdmin)
            query = query.Where(o => !o.IsArchived);
        else
            query = query.Where(o => o.UserId == userId);

        if (fromDate.HasValue)
            query = query.Where(o => o.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
        {
            var endDate = toDate.Value.AddDays(1);
            query = query.Where(o => o.CreatedAt < endDate);
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt)
            .Select(o => o.ToDto())
            .ToListAsync();

        return Ok(new ApiResponse<List<OrderResponse>>(true, orders, null));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> GetOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.BookType)
            .Include(o => o.Timeline)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new ApiResponse<OrderResponse>(false, null, "الطلب غير موجود"));

        return Ok(new ApiResponse<OrderResponse>(true, order.ToDto(), null));
    }

    [Authorize]
    [HttpPut("{id}/transaction")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> SubmitTransaction(Guid id, [FromBody] TransactionRequest request)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new ApiResponse<OrderResponse>(false, null, "الطلب غير موجود"));

        if (order.UserId != userId)
            return Unauthorized(new ApiResponse<OrderResponse>(false, null, "لا يمكنك تعديل هذا الطلب"));

        if (order.Status != "pending_payment")
            return BadRequest(new ApiResponse<OrderResponse>(false, null, "الطلب ليس بانتظار الدفع"));

        if (string.IsNullOrWhiteSpace(request.TransactionNumber))
            return BadRequest(new ApiResponse<OrderResponse>(false, null, "رقم العملية مطلوب"));

        order.TransactionNumber = request.TransactionNumber;
        order.Status = "pending_approval";

        _context.OrderTimelines.Add(new OrderTimeline
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Status = "pending_approval",
            Date = DateTime.UtcNow,
            Note = "تم إرسال رقم العملية"
        });

        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("OrderStatusChanged", id.ToString(), "pending_approval");

        return Ok(new ApiResponse<OrderResponse>(true, order.ToDto(), "تم إرسال رقم التحويل بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}/status")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> UpdateStatus(Guid id, [FromBody] string status)
    {
        var order = await _context.Orders.Include(o => o.BookType).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return NotFound(new ApiResponse<OrderResponse>(false, null, "الطلب غير موجود"));

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        order.Timeline.Add(new OrderTimeline
        {
            Id = Guid.NewGuid(),
            OrderId = order.Id,
            Status = status,
            Date = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("OrderStatusChanged", id.ToString(), status);

        return Ok(new ApiResponse<OrderResponse>(true, order.ToDto(), "تم تحديث الحالة"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}/payment")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> ApprovePayment(Guid id, [FromBody] PaymentAction action)
    {
        var order = await _context.Orders.Include(o => o.BookType).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return NotFound(new ApiResponse<OrderResponse>(false, null, "الطلب غير موجود"));

        if (action.Approved)
        {
            order.Status = "payment_accepted";
            order.Timeline.Add(new OrderTimeline
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                Status = "payment_accepted",
                Date = DateTime.UtcNow,
                Note = "تم قبول الدفع"
            });
        }
        else
        {
            order.Status = "rejected";
            order.RejectionReason = action.Reason;
            order.Timeline.Add(new OrderTimeline
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                Status = "rejected",
                Date = DateTime.UtcNow,
                Note = $"تم رفض الدفع: {action.Reason}"
            });
        }

        order.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("OrderStatusChanged", id.ToString(), order.Status);

        return Ok(new ApiResponse<OrderResponse>(true, order.ToDto(), "تم تحديث حالة الدفع"));
    }

    [Authorize(Roles = "admin")]
    [HttpGet("all")]
    public async Task<ActionResult<ApiResponse<List<OrderResponse>>>> GetAllOrders([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var query = _context.Orders.Include(o => o.BookType).Where(o => !o.IsArchived).AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(o => o.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
        {
            var endDate = toDate.Value.AddDays(1);
            query = query.Where(o => o.CreatedAt < endDate);
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt)
            .Select(o => o.ToDto())
            .ToListAsync();

        return Ok(new ApiResponse<List<OrderResponse>>(true, orders, null));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> ArchiveOrder(Guid id)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return NotFound(new ApiResponse<object>(false, null!, "الطلب غير موجود"));

        order.IsArchived = true;
        order.ArchivedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("OrderStatusChanged", id.ToString(), order.Status);

        return Ok(new ApiResponse<object>(true, null!, "تم أرشفة الطلب"));
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{id}/writer-summary")]
    public async Task<IActionResult> GetWriterSummary(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.BookType)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new ApiResponse<OrderResponse>(false, null, "الطلب غير موجود"));

        var pdfService = new PdfService();
        var pdfBytes = pdfService.GenerateWriterSummary(order);
        return File(pdfBytes, "text/html", $"ملخص_الكاتب_{order.OrderNumber}.html");
    }
}

public record PaymentAction(bool Approved, string? Reason = null);
