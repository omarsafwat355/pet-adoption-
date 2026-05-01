using Microsoft.AspNetCore.Mvc;

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
        try{return Ok(_auth.Register(dto));}
        catch(Exception e){return BadRequest(e.Message);}
    }
    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        try {return Ok(_auth.Login(dto));}
        catch(Exception e){return Unauthorized(e.Message);}
    }
}
