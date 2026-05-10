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
    public async Task<IActionResult> Apply(AdoptionRequestDto dto)
    {
        var id = int.Parse(User.FindFirst("UserId").Value);
        var result = _service.Apply(dto.PetId, id, dto.Message);
        // Notify pet owner: new adoption request arrived
        await _hub.Clients.All.SendAsync("NewAdoptionRequest");
        await _hub.Clients.All.SendAsync("ReceiveNotification", "New adoption request received!");
        return Ok(result);
    }

    [Authorize(Roles = "Admin,PetOwner")]
    [HttpPost("approve")]
    public async Task<IActionResult> Approve([FromQuery] int id)
    {
        var result = _service.Approve(id);
        // Notify adopter: their request was approved
        await _hub.Clients.All.SendAsync("AdoptionStatusChanged");
        await _hub.Clients.All.SendAsync("ReceiveNotification", "An adoption request has been approved!");
        return Ok(result);
    }

    [Authorize(Roles = "Admin,PetOwner")]
    [HttpPost("reject")]
    public async Task<IActionResult> Reject([FromQuery] int id)
    {
        var result = _service.Reject(id);
        // Notify adopter: their request was rejected
        await _hub.Clients.All.SendAsync("AdoptionStatusChanged");
        await _hub.Clients.All.SendAsync("ReceiveNotification", "An adoption request has been rejected.");
        return Ok(result);
    }

    [Authorize(Roles = "PetOwner")]
    [HttpGet("requests")]
    public IActionResult GetRequests()
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_service.GetRequestsForOwner(userId));
    }
}
