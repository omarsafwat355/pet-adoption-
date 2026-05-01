using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🗄️ Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("PetAdoptDb"));

// 🔧 Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PetService>();
builder.Services.AddScoped<AdoptionService>();
builder.Services.AddScoped<FavoriteService>();   // ✅ FIXED
builder.Services.AddScoped<ReviewService>();     // ✅ FIXED
builder.Services.AddScoped<JwtService>();

// 📦 Controllers
builder.Services.AddControllers();

// 📘 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔐 JWT Authentication
var key = builder.Configuration["Jwt:Key"] 
          ?? "THIS_IS_A_SECRET_KEY_12345";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key)
        )
    };
});

// 🔒 Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// 📘 Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔐 Middleware
app.UseHttpsRedirection();

app.UseAuthentication();   // ⚠️ must be before authorization
app.UseAuthorization();

app.MapControllers();

app.Run();