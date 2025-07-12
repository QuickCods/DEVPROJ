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

        // NOVO: FK para AspNetUsers.Id
        [Required]
        [Column(TypeName = "nvarchar(450)")]
        public string IdentityUserId { get; set; } = string.Empty;
        
        [ForeignKey(nameof(IdentityUserId))]
        public IdentityUser IdentityUser { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required, DataType(DataType.Date)]
        // vamos armazenar como DateTime, mas no DTO aceitamos "dd/MM/yy"
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

        public ICollection<Investment>? Investments { get; set; }

        
    }
}
