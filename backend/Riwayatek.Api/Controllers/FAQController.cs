using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FAQController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public FAQController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<FAQ>>> GetAll()
    {
        var faqs = await _context.FAQs.Where(f => f.IsActive).OrderBy(f => f.Order).ToListAsync();
        return Ok(faqs);
    }
}
