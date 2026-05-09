using Microsoft.EntityFrameworkCore;

public class FavoriteService
{
    private readonly AppDbContext _context;

    public FavoriteService(AppDbContext context)
    {
        _context = context;
    }

    public string Add(int userId, int petId)
    {
        var exists = _context.Favorites
            .Any(f => f.UserId == userId && f.PetId == petId);
        if (exists)
            throw new Exception("Already in favorites.");

        _context.Favorites.Add(new Favorite { UserId = userId, PetId = petId });
        _context.SaveChanges();
        return "Added to favorites.";
    }

    public List<PetResponseDto> Get(int userId)
    {
        return _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Pet)
            .Select(f => new PetResponseDto
            {
                Id = f.Pet.Id,
                Name = f.Pet.Name,
                Age = f.Pet.Age,
                Breed = f.Pet.Breed,
                Gender = f.Pet.Gender,
                Location = f.Pet.Location,
                Status = f.Pet.Status
            }).ToList();
    }
}