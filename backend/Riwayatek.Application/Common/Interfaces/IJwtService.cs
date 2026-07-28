using Riwayatek.Domain.Entities;

namespace Riwayatek.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
