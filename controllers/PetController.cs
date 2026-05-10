using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/[controller]")]
public class PetController : ControllerBase
{
    private readonly PetService _Service;
    private readonly IHubContext<NotificationHub> _hub;

    public PetController(PetService service, IHubContext<NotificationHub> hub)
    {
        _Service = service;
        _hub = hub;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_Service.GetApprovedPets());

    [Authorize(Roles = "PetOwner")]
    [HttpGet("mypets")]
    public IActionResult MyPets()
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_Service.GetMyPets(userId));
    }

    [Authorize(Roles = "Adopter")]
    [HttpGet("adopted")]
    public IActionResult AdoptedPets()
    {
        var userId = int.Parse(User.FindFirst("UserId").Value);
        return Ok(_Service.GetAdoptedPets(userId));
    }

    [Authorize(Roles = "PetOwner")]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] PetCreateDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst("UserId").Value);
            
            string imageUrl = null;
            if (dto.Image != null && dto.Image.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(dto.Image.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Only .jpg, .jpeg, .png, and .webp files are allowed.");

                if (dto.Image.Length > 5 * 1024 * 1024)
                    return BadRequest("File size cannot exceed 5MB.");

                var fileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }
                
                imageUrl = $"/uploads/{fileName}";
            }

            var result = _Service.Create(dto, userId, imageUrl);
            // Notify admin via SignalR
            await _hub.Clients.All.SendAsync("ReceiveNotification", $"New pet post submitted: {dto.Name}");
            return Ok(result);
        }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public IActionResult Pending() => Ok(_Service.GetPendingPets());

    [Authorize(Roles = "Admin")]
    [HttpPost("approve")]
    public IActionResult Approve([FromQuery] int id)
    {
        try { return Ok(_Service.ApprovePet(id)); }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("reject")]
    public IActionResult Reject([FromQuery] int id)
    {
        try { return Ok(_Service.RejectPet(id)); }
        catch (Exception e) { return BadRequest(e.Message); }
    }

    [Authorize(Roles = "PetOwner")]
    [HttpPut]
    public IActionResult Update([FromBody] PetUpdateDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst("UserId").Value);
            return Ok(_Service.UpdatePet(dto, userId));
        }
        catch (Exception e) { return BadRequest(e.ToString()); }
    }

    [Authorize(Roles = "PetOwner")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst("UserId").Value);
            return Ok(_Service.DeletePet(id, userId));
        }
        catch (Exception e) { return BadRequest(e.Message); }
    }
}