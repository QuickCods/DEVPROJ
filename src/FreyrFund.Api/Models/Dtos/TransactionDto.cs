namespace FreyrFund.Api.Models.Dtos
{
    public class TransactionDto
    {
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; } = string.Empty;
        public int? ProjectId { get; set; }
        public string? ProjectTitle { get; set; }
    }
}