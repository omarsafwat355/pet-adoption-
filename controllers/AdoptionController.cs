using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class AdopationController : ControllerBase
{
    private readonly AdoptionService _service;
    public AdopationController(AdoptionService service)
    {
        _service = service;
    }
    [Authorize(Roles = "Adopter")]
    [HttpPost("apply")]
    public IActionResult Apply(AdoptionRequestDto dto)
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.Apply(dto.PetId, id, dto.Message ));
    }
    [Authorize(Roles = "Admin, PetOwner")]
    [HttpPost("approve")]
    public IActionResult Approve(int id)=> Ok(_service.Approve(id));

    [Authorize(Roles = "Admin, PetOwner")]
    [HttpPost("reject")]
    public IActionResult Reject(int id)=> Ok(_service.Reject(id));

}

