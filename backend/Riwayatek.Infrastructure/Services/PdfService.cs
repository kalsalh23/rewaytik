using Riwayatek.Domain.Entities;

namespace Riwayatek.Infrastructure.Services;

public class PdfService
{
    public byte[] GenerateWriterSummary(Order order)
    {
        var hobbies = string.IsNullOrEmpty(order.Hobbies) ? new List<string>() : order.Hobbies.Split(',').ToList();
        var qualities = string.IsNullOrEmpty(order.Qualities) ? new List<string>() : order.Qualities.Split(',').ToList();
        var memories = string.IsNullOrEmpty(order.Memories) ? new List<string>() : order.Memories.Split(',').ToList();
        var images = string.IsNullOrEmpty(order.Images) ? new List<string>() : order.Images.Split(',').ToList();

        var html = $@"
<!DOCTYPE html>
<html dir='rtl' lang='ar'>
<head><meta charset='UTF-8'><title>ملخص الكاتب - {order.OrderNumber}</title>
<style>
  body {{ font-family: 'Traditional Arabic', Arial, sans-serif; padding: 40px; color: #333; }}
  h1 {{ color: #C8A45C; border-bottom: 2px solid #C8A45C; padding-bottom: 10px; }}
  h2 {{ color: #2D2D2D; margin-top: 30px; }}
  .section {{ margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }}
  .label {{ font-weight: bold; color: #666; font-size: 14px; }}
  .value {{ font-size: 16px; margin-top: 5px; }}
  .tag {{ display: inline-block; padding: 4px 12px; margin: 3px; background: #C8A45C20; border-radius: 20px; font-size: 14px; }}
  .header {{ text-align: center; margin-bottom: 40px; }}
  .header h1 {{ font-size: 28px; border: none; }}
  .header p {{ color: #999; }}
  table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
  td {{ padding: 8px 12px; border: 1px solid #ddd; }}
  td.label {{ background: #f0f0f0; width: 30%; }}
</style></head>
<body>
<div class='header'>
  <h1>ملخص الكاتب</h1>
  <p>رقم الطلب: {order.OrderNumber} | تاريخ الإنشاء: {order.CreatedAt:yyyy/MM/dd}</p>
</div>

<div class='section'>
  <h2>معلومات الطلب</h2>
  <table>
    <tr><td class='label'>نوع الكتاب</td><td>{order.BookType?.NameAr ?? ""}</td></tr>
    <tr><td class='label'>حالة الطلب</td><td>{order.Status}</td></tr>
    <tr><td class='label'>المبلغ</td><td>{order.TotalAmount} ﷼</td></tr>
  </table>
</div>

<div class='section'>
  <h2>معلومات الشخصية</h2>
  <table>
    <tr><td class='label'>الاسم</td><td>{order.CharacterName}</td></tr>
    <tr><td class='label'>العمر</td><td>{order.Age}</td></tr>
    <tr><td class='label'>الجنسية</td><td>{order.Nationality}</td></tr>
    <tr><td class='label'>نوع القصة</td><td>{order.StoryType}</td></tr>
    <tr><td class='label'>هدف القصة</td><td>{order.StoryGoal}</td></tr>
  </table>
</div>

<div class='section'>
  <h2>الهوايات</h2>
  <div>{string.Join("", hobbies.Select(h => $"<span class='tag'>{h}</span>"))}</div>
</div>

<div class='section'>
  <h2>الصفات</h2>
  <div>{string.Join("", qualities.Select(q => $"<span class='tag'>{q}</span>"))}</div>
</div>

<div class='section'>
  <h2>الذكريات</h2>
  <ul>{string.Join("", memories.Select(m => $"<li>{m}</li>"))}</ul>
</div>

<div class='section'>
  <h2>رسالة العميل</h2>
  <p>{order.ClientMessage}</p>
</div>

<div class='section'>
  <h2>عنوان الشحن</h2>
  <table>
    <tr><td class='label'>الاسم</td><td>{order.ShippingFullName}</td></tr>
    <tr><td class='label'>الهاتف</td><td>{order.ShippingPhone}</td></tr>
    <tr><td class='label'>المدينة</td><td>{order.ShippingCity}</td></tr>
    <tr><td class='label'>الحي</td><td>{order.ShippingDistrict}</td></tr>
    <tr><td class='label'>الشارع</td><td>{order.ShippingStreet}</td></tr>
    <tr><td class='label'>رقم المبنى</td><td>{order.ShippingBuildingNumber}</td></tr>
  </table>
</div>

<div class='section'>
  <h2>معلومات الطباعة</h2>
  <table>
    <tr><td class='label'>عدد الصور المرفقة</td><td>{images.Count}</td></tr>
    <tr><td class='label'>عدد الصفحات التقديري</td><td>{order.BookType?.MinPages ?? 20} - {order.BookType?.MaxPages ?? 30}</td></tr>
  </table>
</div>
</body></html>";

        return System.Text.Encoding.UTF8.GetBytes(html);
    }
}
