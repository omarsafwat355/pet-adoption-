using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class FavoriteController : ControllerBase
{
    private readonly FavoriteService _service;

    public FavoriteController(FavoriteService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Adopter")]
    [HttpPost]
    public IActionResult Add(FavoriteDto dto)
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.Add(id, dto.PetId));
    }

    [Authorize(Roles = "Adopter")]
    [HttpGet]
    public IActionResult Get()
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.Get(id));
    }
}