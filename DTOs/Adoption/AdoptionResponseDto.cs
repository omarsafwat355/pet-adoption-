public class AdoptionResponseDto
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public string PetName { get; set; }
    public int AdopterId { get; set; }
    public string AdopterName { get; set; }
    public string AdopterEmail { get; set; }
    public string Message { get; set; }
    public string Status { get; set; }
}
