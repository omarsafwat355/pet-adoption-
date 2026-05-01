public class AuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;

    public AuthService(AppDbContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;
    }
    public AuthResponseDto Register(RegisterDto dto)
    {
        if
    }
}