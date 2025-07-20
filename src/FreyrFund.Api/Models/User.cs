using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace FreyrFund.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(450)")]
        public string IdentityUserId { get; set; } = string.Empty;
        
        [ForeignKey(nameof(IdentityUserId))]
        public IdentityUser IdentityUser { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required, DataType(DataType.Date)]
        
        public DateTime DateOfBirth { get; set; }

        [Required, RegularExpression(@"^\d{9}$", ErrorMessage = "O NIF deve ter exatamente 9 dígitos.")]
        public string Nif { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required, Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "User";

        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = 0;

        
        public bool IsDeleted { get; set; } = false;


        public ICollection<Investment>? Investments { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }

        
    }
}
