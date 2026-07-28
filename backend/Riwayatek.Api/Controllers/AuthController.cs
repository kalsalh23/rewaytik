using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.DTOs;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Application.Common.Mappings;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(IApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new ApiResponse<AuthResponse>(false, null, "البريد الإلكتروني أو كلمة المرور غير صحيحة"));

        var token = _jwtService.GenerateToken(user);
        return Ok(new ApiResponse<AuthResponse>(true, new AuthResponse(token, user.ToDto()), "تم تسجيل الدخول بنجاح"));
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
            return BadRequest(new ApiResponse<AuthResponse>(false, null, "كلمة المرور غير متطابقة"));

        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest(new ApiResponse<AuthResponse>(false, null, "البريد الإلكتروني مستخدم بالفعل"));

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "user",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);
        return Ok(new ApiResponse<AuthResponse>(true, new AuthResponse(token, user.ToDto()), "تم إنشاء الحساب بنجاح"));
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetProfile()
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound(new ApiResponse<UserDto>(false, null, "المستخدم غير موجود"));

        return Ok(new ApiResponse<UserDto>(true, user.ToDto(), null));
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateProfile(UserDto request)
    {
        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound(new ApiResponse<UserDto>(false, null, "المستخدم غير موجود"));

        user.Name = request.Name;
        user.Email = request.Email;
        user.Phone = request.Phone;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new ApiResponse<UserDto>(true, user.ToDto(), "تم تحديث البيانات بنجاح"));
    }
}
