using Microsoft.AspNetCore.SignalR;

namespace Riwayatek.Api;

public class RiwayatekHub : Hub
{
    public async Task JoinOrderGroup(string orderId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, orderId);
    }

    public async Task LeaveOrderGroup(string orderId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, orderId);
    }

    public async Task NotifyStatusUpdate(string orderId, string status)
    {
        await Clients.Group(orderId).SendAsync("StatusUpdated", orderId, status);
    }
}
