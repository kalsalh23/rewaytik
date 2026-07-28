using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.Interfaces;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AdminController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult> GetDashboard()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var pendingReview = await _context.Orders.CountAsync(o => o.Status == "pending_review");
        var totalCustomers = await _context.Users.CountAsync(u => u.Role == "user");
        var totalRevenue = await _context.Orders.Where(o => o.Status != "pending_payment" && o.Status != "rejected").SumAsync(o => o.TotalAmount);

        return Ok(new
        {
            totalOrders,
            pendingReview,
            totalCustomers,
            totalRevenue,
            ordersByStatus = await _context.Orders.GroupBy(o => o.Status).Select(g => new { status = g.Key, count = g.Count() }).ToListAsync()
        });
    }

    [HttpGet("customers")]
    public async Task<ActionResult> GetCustomers()
    {
        var customers = await _context.Users
            .Where(u => u.Role == "user")
            .Select(u => new { u.Id, u.Name, u.Email, u.Phone, u.CreatedAt, ordersCount = u.Orders.Count })
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return Ok(customers);
    }

    [HttpGet("reports")]
    public async Task<ActionResult> GetReports()
    {
        var monthlyOrders = await _context.Orders
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new { year = g.Key.Year, month = g.Key.Month, count = g.Count(), revenue = g.Sum(o => o.TotalAmount) })
            .OrderBy(g => g.year).ThenBy(g => g.month)
            .ToListAsync();

        return Ok(new { monthlyOrders });
    }
}
