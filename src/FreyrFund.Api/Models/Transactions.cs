using System.ComponentModel.DataAnnotations.Schema;

namespace FreyrFund.Server.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public TransactionType Type { get; set; }
    }

    public enum TransactionType
    {
        TopUp,
        Withdrawal,
        Investment
    }
}