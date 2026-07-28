namespace Riwayatek.Domain.Entities;

public class FAQ
{
    public Guid Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string QuestionAr { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string AnswerAr { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsActive { get; set; } = true;
}
