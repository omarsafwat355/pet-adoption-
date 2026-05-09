using Microsoft.EntityFrameworkCore;

public class AdoptionService
{
    private readonly AppDbContext _context;

    public AdoptionService(AppDbContext context)
    {
        _context = context;
    }

    public string Apply(int petId, int adopterId, string message)
    {
        var pet = _context.Pets.Find(petId) ?? throw new Exception("Pet not found.");
        if (pet.Status != "Approved")
            throw new Exception("This pet is not available for adoption.");

        var existing = _context.AdoptionRequests
            .FirstOrDefault(r => r.PetId == petId && r.AdopterId == adopterId);
        if (existing != null)
            throw new Exception("You have already applied for this pet.");

        var request = new AdoptionRequest
        {
            PetId = petId,
            AdopterId = adopterId,
            Message = message,
            Status = "Pending"
        };

        _context.AdoptionRequests.Add(request);
        _context.SaveChanges();
        return "Application submitted.";
    }

    public string Approve(int id)
    {
        var request = _context.AdoptionRequests
            .Include(r => r.Pet)
            .FirstOrDefault(r => r.Id == id) ?? throw new Exception("Request not found.");

        request.Status = "Approved";
        request.Pet.Status = "Adopted"; // Change pet status to Adopted
        _context.SaveChanges();
        return "Request approved. Pet marked as adopted.";
    }

    public string Reject(int id)
    {
        var request = _context.AdoptionRequests.Find(id) ?? throw new Exception("Request not found.");
        request.Status = "Rejected";
        _context.SaveChanges();
        return "Request rejected.";
    }

    public List<AdoptionResponseDto> GetRequestsForOwner(int ownerId)
    {
        return _context.AdoptionRequests
            .Include(r => r.Pet)
            .Include(r => r.Adopter)
            .Where(r => r.Pet.OwnerId == ownerId)
            .Select(r => new AdoptionResponseDto
            {
                Id = r.Id,
                PetId = r.PetId,
                PetName = r.Pet.Name,
                AdopterId = r.AdopterId,
                AdopterName = r.Adopter.Name,
                AdopterEmail = r.Adopter.Email,
                Message = r.Message,
                Status = r.Status
            })
            .ToList();
    }
}