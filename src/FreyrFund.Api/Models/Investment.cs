using FreyrFund.Api.Models;
namespace FreyrFund.Server.Models
{
    public class Investment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }
}