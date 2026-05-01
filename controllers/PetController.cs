using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class PetController : ControllerBase
{
    private readonly PetService _Service;

    public PetController(PetService service)
    {
        _Service = service;
    }
    [HttpGet]
    public IActionResult GetAll()=>Ok(_Service.GetApprovedPets());
    [Authorize(Roles = "PetOwner")]

    [HttpPost]
    public IActionResult Create(PetCreateDto dto)
    {
       try{var userId = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_Service.Create(dto, userId));}
        catch(Exception e){return BadRequest(e.Message);}
    }
    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public IActionResult Pending() => Ok(_Service.GetPendingPets());

     [Authorize(Roles = "Admin")]
     [HttpPost("approve")]
     public IActionResult Approve(int id)
    {
        try{return Ok(_Service.ApprovePet(id));}
        catch(Exception e){return BadRequest(e.Message);}
    }

     [Authorize(Roles = "Admin")]
     [HttpPost("reject")]
      public IActionResult Reject(int id){
        try{return Ok(_Service.RejectPet(id));}
        catch(Exception e){return BadRequest(e.Message);}
    }
}