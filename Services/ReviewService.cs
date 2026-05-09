public class ReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }

    public string Add(int userId, int petId, int rating, string comment)
    {
        // Verify user has adopted THIS pet (has an approved adoption request)
        var hasAdopted = _context.AdoptionRequests
            .Any(r => r.AdopterId == userId && r.PetId == petId && r.Status == "Approved");
        if (!hasAdopted)
            throw new Exception("You can only review after a successful adoption of this pet.");

        // Check if review already exists
        var existingReview = _context.Reviews.FirstOrDefault(r => r.UserId == userId && r.PetId == petId);
        if (existingReview != null)
        {
            existingReview.Rating = rating;
            existingReview.Comment = comment;
        }
        else
        {
            _context.Reviews.Add(new Review
            {
                UserId = userId,
                PetId = petId,
                Rating = rating,
                Comment = comment
            });
        }
        
        _context.SaveChanges();
        return "Review submitted.";
    }
}