using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Pet> Pets { get; set; }
    public DbSet<AdoptionRequest> AdoptionRequests { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Image> Images { get; set; }
}