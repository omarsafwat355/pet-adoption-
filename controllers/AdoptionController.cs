using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/[controller]")]
public class AdopationController : ControllerBase
{
    private readonly AdoptionService _service;
    private readonly IHubContext<NotificationHub> _hub;

    public AdopationController(AdoptionService service, IHubContext<NotificationHub> hub)
    {
        _service = service;
        _hub = hub;
    }

    [Authorize(Roles = "Adopter")]
    [HttpPost("apply")]
    public IActionResult Apply(AdoptionRequestDto dto)
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        var result = _service.Apply(dto.PetId, id, dto.Message);
        // Notify pet owner via SignalR
        _hub.Clients.All.SendAsync("ReceiveNotification", "New adoption request received!");
        return Ok(result);
    }

    [Authorize(Roles = "Admin,PetOwner")]
    [HttpPost("approve")]
    public IActionResult Approve(int id) => Ok(_service.Approve(id));

    [Authorize(Roles = "Admin,PetOwner")]
    [HttpPost("reject")]
    public IActionResult Reject(int id) => Ok(_service.Reject(id));

    [Authorize(Roles = "PetOwner")]
    [HttpGet("requests")]
    public IActionResult GetRequests()
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.GetRequestsForOwner(userId));
    }
}
