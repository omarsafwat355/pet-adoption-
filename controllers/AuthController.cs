using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        try { return Ok(_auth.Register(dto)); }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        try { return Ok(_auth.Login(dto)); }
        catch (Exception e) { return Unauthorized(e.Message); }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public IActionResult GetPendingUsers() => Ok(_auth.GetPendingUsers());

    [Authorize(Roles = "Admin")]
    [HttpPost("approve")]
    public IActionResult ApproveUser([FromQuery] int id)
    {
        try { return Ok(_auth.ApproveUser(id)); }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reject")]
    public IActionResult RejectUser([FromQuery] int id)
    {
        try { return Ok(_auth.RejectUser(id)); }
        catch (Exception e) { return BadRequest(e.Message); }
    }
}
