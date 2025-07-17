using FreyrFund.Server.Models;


namespace FreyrFund.Api.Models.Dtos
{
    public class ProjectViewDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Rate { get; set; }
        public int Term { get; set; }
        public decimal Target { get; set; }
        public decimal Funded { get; set; }
        public decimal FundingPercentage { get; set; }
        public decimal RemainingAmount { get; set; }
        public bool IsFullyFunded { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Description { get; set; } = string.Empty;
        public RiskLevel Risk { get; set; }
        public string RiskDescription { get; set; } = string.Empty;
    }
}
