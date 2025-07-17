using System.ComponentModel.DataAnnotations;

public class ProjectDto
{
    public int? Id { get; set; }

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

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [EnumDataType(typeof(RiskLevel))] // <-- Importante!
    public RiskLevel Risk { get; set; }
}
