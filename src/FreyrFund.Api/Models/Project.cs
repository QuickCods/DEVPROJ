namespace FreyrFund.Server.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ReturnRate { get; set; }
        public int DurationMonths { get; set; }
        public decimal AmountRequired { get; set; }
        public decimal AmountFunded { get; set; } = 0;

        public ICollection<Investment>? Investments { get; set; }
    }
}