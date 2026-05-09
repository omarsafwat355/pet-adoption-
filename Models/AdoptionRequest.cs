public class AdoptionRequest
{
    public int Id { get; set; }
    public string Message { get; set; } // adopter's history/experience
    public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected"

    public int PetId { get; set; }
    public Pet Pet { get; set; }

    public int AdopterId { get; set; }
    public User Adopter { get; set; }
}
