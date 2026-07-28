using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public GalleryController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<GalleryItem>>> GetAll()
    {
        var items = await _context.GalleryItems.Where(g => g.IsActive).OrderByDescending(g => g.CreatedAt).ToListAsync();
        return Ok(items);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<List<GalleryItem>>> GetAllAdmin()
    {
        var items = await _context.GalleryItems.OrderByDescending(g => g.CreatedAt).ToListAsync();
        return Ok(items);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<GalleryItem>> Create([FromBody] GalleryItemRequest request)
    {
        var item = new GalleryItem
        {
            Id = Guid.NewGuid(),
            ImageUrl = request.ImageUrl,
            Title = request.Title,
            TitleAr = request.TitleAr,
            Description = request.Description,
            DescriptionAr = request.DescriptionAr,
            BookType = request.BookType,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };
        _context.GalleryItems.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<GalleryItem>> Update(Guid id, [FromBody] GalleryItemRequest request)
    {
        var item = await _context.GalleryItems.FindAsync(id);
        if (item == null)
            return NotFound(new { message = "العنصر غير موجود" });

        item.ImageUrl = request.ImageUrl;
        item.Title = request.Title;
        item.TitleAr = request.TitleAr;
        item.Description = request.Description;
        item.DescriptionAr = request.DescriptionAr;
        item.BookType = request.BookType;
        item.IsActive = request.IsActive;
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var item = await _context.GalleryItems.FindAsync(id);
        if (item == null)
            return NotFound(new { message = "العنصر غير موجود" });

        _context.GalleryItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "تم حذف العنصر" });
    }
}

public record GalleryItemRequest(string ImageUrl, string Title, string TitleAr, string Description, string DescriptionAr, string BookType, bool IsActive = true);
