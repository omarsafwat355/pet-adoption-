using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class ReviewController : ControllerBase
{
    private readonly ReviewService _service;
    public ReviewController(ReviewService _service)
    {
        _service = service;
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("add")]
    public IActionResult Add(ReviewDto dto)
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.Add(id , dto.Rating, dto.Comment));
    }
    
}