public class Pet
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string Type { get; set; }  // Dog, Cat, etc.
    public string Breed { get; set; }
    public string Gender { get; set; }
    public string HealthStatus { get; set; }
    public string Location { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected", "Adopted"

    public int OwnerId { get; set; }
    public User Owner { get; set; }

    public ICollection<AdoptionRequest> AdoptionRequests { get; set; }
    public ICollection<Favorite> Favorites { get; set; }
    public ICollection<Review> Reviews { get; set; }
}
