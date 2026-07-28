using Microsoft.EntityFrameworkCore;
using Riwayatek.Domain.Entities;

namespace Riwayatek.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.Users.AnyAsync(u => u.Email == "kosaialasalh1@gmail.com"))
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Name = "مدير النظام",
                Email = "kosaialasalh1@gmail.com",
                Phone = "0990000000",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("oday2001#"),
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
        }

        if (!await context.BookTypes.AnyAsync())
        {
            context.BookTypes.AddRange(
                new BookType { Id = Guid.NewGuid(), Name = "Childhood Story", NameAr = "قصة طفولة", Description = "Document childhood memories", DescriptionAr = "وثق ذكريات الطفولة في كتاب جميل", Icon = "👶", Price = 65000, MinPages = 20, MaxPages = 30, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Youth Story", NameAr = "قصة شباب", Description = "Document youth achievements", DescriptionAr = "سجل مرحلة الشباب والإنجازات", Icon = "🌟", Price = 87000, MinPages = 20, MaxPages = 30, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Graduation Story", NameAr = "قصة تخرج", Description = "The journey of success", DescriptionAr = "رحلة النجاح من أول يوم دراسي حتى التخرج", Icon = "🎓", Price = 105000, MinPages = 25, MaxPages = 35, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Success Story", NameAr = "قصة نجاح", Description = "Inspiring career journey", DescriptionAr = "سرد ملهم لرحلتك المهنية وإنجازاتك", Icon = "🏆", Price = 120000, MinPages = 30, MaxPages = 40, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Love Story", NameAr = "قصة حب", Description = "Beautiful love story", DescriptionAr = "أجمل مشاعر الحب والرومانسية في كتاب فاخر", Icon = "💕", Price = 95000, MinPages = 20, MaxPages = 30, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Travel Story", NameAr = "قصة رحلة", Description = "Travel memories around the world", DescriptionAr = "أجمل ذكريات أسفارك ومغامراتك حول العالم", Icon = "✈️", Price = 110000, MinPages = 30, MaxPages = 40, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Biography", NameAr = "سيرة ذاتية", Description = "Professional biography", DescriptionAr = "سيرتك المهنية بقصة ملهمة", Icon = "💼", Price = 140000, MinPages = 40, MaxPages = 50, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Custom Gift", NameAr = "هدية مخصصة", Description = "Unique gift for special people", DescriptionAr = "هدية فريدة ومميزة لأعز الناس", Icon = "🎁", Price = 85000, MinPages = 20, MaxPages = 30, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Family Story", NameAr = "قصة عائلة", Description = "Family history and ancestors stories", DescriptionAr = "تاريخ عائلتك وقصص الأجداد", Icon = "👨‍👩‍👧‍👦", Price = 150000, MinPages = 40, MaxPages = 60, IsActive = true },
                new BookType { Id = Guid.NewGuid(), Name = "Custom Story", NameAr = "قصة مخصصة", Description = "Any other story you want to immortalize", DescriptionAr = "أي قصة أخرى تريد تخليدها", Icon = "✨", Price = 100000, MinPages = 25, MaxPages = 40, IsActive = true }
            );
        }
        else
        {
            var first = await context.BookTypes.FirstOrDefaultAsync();
            if (first != null && first.Price < 1000)
            {
                var all = await context.BookTypes.ToListAsync();
                var prices = new[] { 65000, 87000, 105000, 120000, 95000, 110000, 140000, 85000, 150000, 100000 };
                for (int i = 0; i < all.Count && i < prices.Length; i++)
                    all[i].Price = prices[i];
            }
        }

        await context.SaveChangesAsync();
    }
}
