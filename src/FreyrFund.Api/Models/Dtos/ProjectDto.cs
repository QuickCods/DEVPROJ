using System.ComponentModel.DataAnnotations;
using FreyrFund.Server.Models;

namespace FreyrFund.Api.Models.Dtos
{
    public class ProjectDto
    {/*
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ReturnRate { get; set; }
        public int DurationMonths { get; set; }
        public decimal AmountRequired { get; set; }
        public decimal AmountFunded { get; set; }

        public ICollection<Investment>? Investments { get; set; }*/
        /* public int Id { get; set; }

        // renomeado de Description
        public string Title { get; set; } = string.Empty;

        // renomeado de ReturnRate
        public decimal Rate { get; set; }

        // renomeado de DurationMonths
        public int Term { get; set; }

        // renomeado de AmountRequired
        public decimal Target { get; set; }

        // renomeado de AmountFunded
        public decimal Funded { get; set; } */

        [Key]
        public int Id { get; set; }
 
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
 
        [Required]
        [Range(0.01, 100)]
        public decimal Rate { get; set; }
 
        [Required]
        [Range(1, 120)]
        public int Term { get; set; }
 
        [Required]
        [Range(1000, 10000000)]
        public decimal Target { get; set; }
 
        [Range(0, 10000000)]
        public decimal Funded { get; set; } = 0;
 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
 
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
 
        // Propriedades calculadas
        public decimal FundingPercentage => Target > 0 ? Math.Round((Funded / Target) * 100, 2) : 0;
 
        public decimal RemainingAmount => Target - Funded;
 
        public bool IsFullyFunded => Funded >= Target;

    }
}