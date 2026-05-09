using Microsoft.AspNetCore.Http;

public class PetCreateDto
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Type { get; set; }
    public string Breed { get; set; }
    public string Gender { get; set; }
    public string HealthStatus { get; set; }
    public string Location { get; set; }
    public string Description { get; set; }
    public IFormFile Image { get; set; }
}
