using Microsoft.AspNetCore.Mvc;
using Riwayatek.Application.Common.DTOs;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public ContactController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<string>>> SendMessage(ContactRequest request)
    {
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Subject = request.Subject,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<string>(true, null, "تم إرسال رسالتك بنجاح"));
    }
}
