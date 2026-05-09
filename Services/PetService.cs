using Microsoft.EntityFrameworkCore;

public class PetService
{
    private readonly AppDbContext _context;

    public PetService(AppDbContext context)
    {
        _context = context;
    }

    public List<PetResponseDto> GetApprovedPets()
    {
        return _context.Pets
            .Include(p => p.Owner)
            .Where(p => p.Status == "Approved")
            .Select(p => MapToDto(p))
            .ToList();
    }

    public List<PetResponseDto> GetPendingPets()
    {
        return _context.Pets
            .Include(p => p.Owner)
            .Where(p => p.Status == "Pending")
            .Select(p => MapToDto(p))
            .ToList();
    }

    public List<PetResponseDto> GetMyPets(int ownerId)
    {
        return _context.Pets
            .Include(p => p.Owner)
            .Include(p => p.Reviews)
            .Where(p => p.OwnerId == ownerId)
            .Select(p => MapToDto(p))
            .ToList();
    }

    public List<PetResponseDto> GetAdoptedPets(int adopterId)
    {
        return _context.AdoptionRequests
            .Include(r => r.Pet)
            .ThenInclude(p => p.Owner)
            .Where(r => r.AdopterId == adopterId && r.Status == "Approved")
            .Select(r => MapToDto(r.Pet))
            .ToList();
    }

    public PetResponseDto Create(PetCreateDto dto, int ownerId, string imageUrl)
    {
        var pet = new Pet
        {
            Name = dto.Name,
            Age = dto.Age,
            Type = dto.Type,
            Breed = dto.Breed,
            Gender = dto.Gender,
            HealthStatus = dto.HealthStatus,
            Location = dto.Location,
            Description = dto.Description,
            ImageUrl = imageUrl,
            OwnerId = ownerId,
            Status = "Pending"
        };

        _context.Pets.Add(pet);
        _context.SaveChanges();

        // Load owner for correct DTO mapping
        _context.Entry(pet).Reference(p => p.Owner).Load();

        return MapToDto(pet);
    }

    public string ApprovePet(int id)
    {
        var pet = _context.Pets.Find(id) ?? throw new Exception("Pet not found.");
        pet.Status = "Approved";
        _context.SaveChanges();
        return "Pet approved.";
    }

    public string RejectPet(int id)
    {
        var pet = _context.Pets.Find(id) ?? throw new Exception("Pet not found.");
        pet.Status = "Rejected";
        _context.SaveChanges();
        return "Pet rejected.";
    }

    public string DeletePet(int id, int requesterId)
    {
        var pet = _context.Pets.Find(id) ?? throw new Exception("Pet not found.");
        if (pet.OwnerId != requesterId)
            throw new Exception("Unauthorized.");
        _context.Pets.Remove(pet);
        _context.SaveChanges();
        return "Pet deleted.";
    }

    public PetResponseDto UpdatePet(PetUpdateDto dto, int requesterId)
    {
        var pet = _context.Pets.Include(p => p.Owner).Include(p => p.Reviews).FirstOrDefault(p => p.Id == dto.Id) 
            ?? throw new Exception("Pet not found.");
            
        if (pet.OwnerId != requesterId)
            throw new Exception("Unauthorized.");

        pet.Name = dto.Name;
        pet.Age = dto.Age;
        pet.Type = dto.Type;
        pet.Breed = dto.Breed;
        pet.Gender = dto.Gender;
        pet.HealthStatus = dto.HealthStatus;
        pet.Location = dto.Location;
        pet.Description = dto.Description;

        _context.SaveChanges();
        return MapToDto(pet);
    }

    private static PetResponseDto MapToDto(Pet p)
    {
        var imageUrl = p.ImageUrl;
        if (!string.IsNullOrEmpty(imageUrl) && imageUrl.StartsWith("/uploads"))
        {
            imageUrl = "https://localhost:7207" + imageUrl;
        }

        var review = p.Reviews?.FirstOrDefault();

        return new PetResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Age = p.Age,
            Type = p.Type,
            Breed = p.Breed,
            Gender = p.Gender,
            HealthStatus = p.HealthStatus,
            Location = p.Location,
            Description = p.Description,
            ImageUrl = imageUrl,
            Status = p.Status,
            OwnerId = p.OwnerId,
            OwnerName = p.Owner != null ? p.Owner.Name : "",
            ReviewRating = review?.Rating,
            ReviewComment = review?.Comment
        };
    }
}
