using FreyrFund.Server.Services;
using Microsoft.AspNetCore.Mvc;
using FreyrFund.Api.Models.Dtos;
using System.Globalization;
using FreyrFund.Server.Data;
using FreyrFund.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
        
    }

    [HttpPost("{userId}/topup")]
    public async Task<IActionResult> TopUp(int userId, [FromBody] decimal amount)
    {
        var result = await _userService.TopUpAsync(userId, amount);
        return result ? Ok() : BadRequest();
    }

    [HttpPost("{userId}/withdraw")]
    public async Task<IActionResult> Withdraw(int userId, [FromBody] decimal amount)
    {
        var result = await _userService.WithdrawAsync(userId, amount);
        return result ? Ok() : BadRequest();
    }

    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteAccount(int userId)
    {
        var result = await _userService.DeleteAccountAsync(userId);
        return result ? Ok() : NotFound();
    }

    [HttpGet("{userId}/portfolio")]
    public async Task<IActionResult> Portfolio(int userId)
    {
        var portfolio = await _userService.GetPortfolioAsync(userId);
        return Ok(portfolio);
    }


    [HttpGet("{userId}/balance")]
    public async Task<ActionResult<decimal>> GetBalance(int userId)
    {
        var balance = await _userService.GetBalanceAsync(userId);
        return Ok(balance);
    }

}