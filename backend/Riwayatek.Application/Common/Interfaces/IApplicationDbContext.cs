using Microsoft.EntityFrameworkCore;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<BookType> BookTypes { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderTimeline> OrderTimelines { get; }
    DbSet<ContactMessage> ContactMessages { get; }
    DbSet<GalleryItem> GalleryItems { get; }
    DbSet<FAQ> FAQs { get; }
    DbSet<SiteSetting> SiteSettings { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
