namespace FreyrFund.Api.Models.Dtos
{
    public class UpdateUserDto
    {
        public string FullName    { get; set; } = null!;
        public string DateOfBirth { get; set; } = null!;
        public string Nif         { get; set; } = null!;
        public string Address     { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Role        { get; set; } = null!;
    }
}