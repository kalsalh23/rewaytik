using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookTypesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public BookTypesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<BookType>>> GetAll()
    {
        var types = await _context.BookTypes.Where(b => b.IsActive).ToListAsync();
        return Ok(types);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookType>> GetById(Guid id)
    {
        var bookType = await _context.BookTypes.FindAsync(id);
        if (bookType == null) return NotFound();
        return Ok(bookType);
    }
}
