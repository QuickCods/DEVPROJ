using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
public class RegisterRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

     [Required]
    [RegularExpression(
        @"^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{2}|\d{4})$",
        ErrorMessage = "Data deve estar no formato jj/MM/aa ou jj/MM/aaaa.")]
    public string DateOfBirth { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{9}$", ErrorMessage = "NIF deve ter 9 dígitos.")]
    public string Nif { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required, Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
}
