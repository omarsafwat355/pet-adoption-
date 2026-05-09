using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ReviewService _service;

    public ReviewController(ReviewService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost]
    public IActionResult Add(ReviewDto dto)
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.Add(id, dto.PetId, dto.Rating, dto.Comment));
    }
}