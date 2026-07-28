using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [Authorize]
    [HttpPost("payment-proof")]
    public async Task<ActionResult> UploadPaymentProof([FromForm] IFormFile file, [FromForm] Guid orderId)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, message = "الملف مطلوب" });

        var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads", "payments");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{orderId}_{DateTime.UtcNow:yyyyMMddHHmmss}_{file.FileName}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var url = $"/uploads/payments/{fileName}";
        return Ok(new { success = true, data = url, message = "تم رفع الملف بنجاح" });
    }

    [Authorize]
    [HttpPost("images")]
    public async Task<ActionResult> UploadImages([FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest(new { success = false, message = "الملفات مطلوبة" });

        var urls = new List<string>();
        var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads", "images");
        Directory.CreateDirectory(uploadsDir);

        foreach (var file in files)
        {
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsDir, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            urls.Add($"/uploads/images/{fileName}");
        }

        return Ok(new { success = true, data = urls, message = "تم رفع الملفات بنجاح" });
    }
}
