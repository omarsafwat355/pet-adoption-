public class Image
{
    public int Id { get; set; }
    public string Url { get; set; }

    public int PetId { get; set; }
    public Pet Pet { get; set; }
}
