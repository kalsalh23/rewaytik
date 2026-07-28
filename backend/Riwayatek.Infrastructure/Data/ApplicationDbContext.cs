using Microsoft.EntityFrameworkCore;
using Riwayatek.Application.Common.Interfaces;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<BookType> BookTypes => Set<BookType>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderTimeline> OrderTimelines => Set<OrderTimeline>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();
    public DbSet<FAQ> FAQs => Set<FAQ>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Name).HasMaxLength(200).IsRequired();
            e.Property(u => u.Email).HasMaxLength(200).IsRequired();
            e.Property(u => u.Phone).HasMaxLength(20);
            e.Property(u => u.Role).HasMaxLength(20).HasDefaultValue("user");
        });

        modelBuilder.Entity<BookType>(e =>
        {
            e.HasKey(b => b.Id);
            e.Property(b => b.Name).HasMaxLength(200).IsRequired();
            e.Property(b => b.NameAr).HasMaxLength(200).IsRequired();
            e.Property(b => b.Price).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.HasKey(o => o.Id);
            e.HasIndex(o => o.OrderNumber).IsUnique();
            e.Property(o => o.OrderNumber).HasMaxLength(50).IsRequired();
            e.Property(o => o.Status).HasMaxLength(50).HasDefaultValue("pending_payment");
            e.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
            e.Property(o => o.IsArchived).HasDefaultValue(false);
            e.HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId);
            e.HasOne(o => o.BookType).WithMany(b => b.Orders).HasForeignKey(o => o.BookTypeId);
        });

        modelBuilder.Entity<OrderTimeline>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasOne(t => t.Order).WithMany(o => o.Timeline).HasForeignKey(t => t.OrderId);
        });

        modelBuilder.Entity<ContactMessage>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Name).HasMaxLength(200).IsRequired();
            e.Property(c => c.Email).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<GalleryItem>(e =>
        {
            e.HasKey(g => g.Id);
            e.Property(g => g.Title).HasMaxLength(200).IsRequired();
            e.Property(g => g.TitleAr).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<FAQ>(e =>
        {
            e.HasKey(f => f.Id);
            e.Property(f => f.Question).HasMaxLength(500).IsRequired();
            e.Property(f => f.QuestionAr).HasMaxLength(500).IsRequired();
        });

        modelBuilder.Entity<SiteSetting>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.Key).IsUnique();
            e.Property(s => s.Key).HasMaxLength(100).IsRequired();
        });
    }
}
