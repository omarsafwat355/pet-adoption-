public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; } // "Admin", "PetOwner", "Adopter"
    public bool IsApproved { get; set; } = false; // Admin approves Shelters/PetOwners

    public ICollection<Pet> Pets { get; set; }
    public ICollection<AdoptionRequest> AdoptionRequests { get; set; }
    public ICollection<Favorite> Favorites { get; set; }
    public ICollection<Review> Reviews { get; set; }
}
