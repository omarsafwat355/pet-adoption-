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
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<JwtService>();

// 📦 Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 📘 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔐 JWT Authentication
var key = builder.Configuration["Jwt:Key"] 
          ?? "THIS_IS_A_SECRET_KEY_1234567890_LONG_ENOUGH";

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

// 📡 SignalR
builder.Services.AddSignalR();

// 🌐 CORS - Allow frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Seed an Admin user
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        db.Users.Add(new User
        {
            Name = "Admin",
            Email = "admin@petadopt.com",
            PasswordHash = PasswordHelper.Hash("Admin123"),
            Role = "Admin",
            IsApproved = true
        });
        db.SaveChanges();
    }
}

// 📘 Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🌐 CORS
app.UseCors("AllowFrontend");

// 🔐 Middleware
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();   // ⚠️ must be before authorization
app.UseAuthorization();

app.MapControllers();

// 📡 SignalR Hub
app.MapHub<NotificationHub>("/notificationHub");

app.Run();