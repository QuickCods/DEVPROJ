namespace FreyrFund.Api.Models.Dtos
{
    public class CreateUserDto
    {
        public string FullName    { get; set; } = null!;
        public string DateOfBirth { get; set; } = null!;
        public string Nif         { get; set; } = null!;
        public string Address     { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Email       { get; set; } = null!;
        public string Password    { get; set; } = null!;
        public string Role        { get; set; } = "User"; 
    }
}