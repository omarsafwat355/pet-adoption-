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
        if (_context.Users.Any(u => u.Email == dto.Email))
            throw new Exception("Email already registered.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = PasswordHelper.Hash(dto.Password),
            Role = dto.Role,
            // All newly registered accounts (Adopters and Pet Owners) wait for admin approval
            IsApproved = dto.Role == "Admin"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return new AuthResponseDto
        {
            Email = user.Email,
            Role = user.Role,
            Token = _jwt.GenerateToken(user)
        };
    }

    public AuthResponseDto Login(LoginDto dto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email)
            ?? throw new Exception("Invalid credentials.");

        if (!PasswordHelper.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid credentials.");

        if (!user.IsApproved)
            throw new Exception("Your account is pending admin approval.");

        return new AuthResponseDto
        {
            Email = user.Email,
            Role = user.Role,
            Token = _jwt.GenerateToken(user)
        };
    }

    public List<object> GetPendingUsers()
    {
        return _context.Users
            .Where(u => !u.IsApproved)
            .Select(u => new { u.Id, u.Name, u.Email, u.Role } as object)
            .ToList();
    }

    public string ApproveUser(int id)
    {
        var user = _context.Users.Find(id) ?? throw new Exception("User not found.");
        user.IsApproved = true;
        _context.SaveChanges();
        return "User approved.";
    }

    public string RejectUser(int id)
    {
        var user = _context.Users.Find(id) ?? throw new Exception("User not found.");
        _context.Users.Remove(user);
        _context.SaveChanges();
        return "User rejected and removed.";
    }
}