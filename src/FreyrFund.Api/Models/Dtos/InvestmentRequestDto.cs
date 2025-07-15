namespace FreyrFund.Api.Models.Dtos
{
    public class InvestmentRequestDto
    {
        public int UserId { get; set; }
        public int ProjectId { get; set; }
        public decimal Amount { get; set; }
    }
}