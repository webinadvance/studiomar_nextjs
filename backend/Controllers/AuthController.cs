using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private const string HARD_CODED_USERNAME = "admin";
    private const string HARD_CODED_PASSWORD = "admin";

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Username == HARD_CODED_USERNAME && request.Password == HARD_CODED_PASSWORD)
        {
            // Create a simple session using cookies
            Response.Cookies.Append("auth_session", "admin_session_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Set to true in production with HTTPS
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddHours(8)
            });

            return Ok(new LoginResponse
            {
                Success = true,
                Message = "Login successful",
                Token = "admin_session_token"
            });
        }

        return Unauthorized(new LoginResponse
        {
            Success = false,
            Message = "Invalid username or password"
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth_session");
        return Ok(new { Success = true, Message = "Logout successful" });
    }

    [HttpGet("check")]
    public IActionResult CheckAuth()
    {
        var authCookie = Request.Cookies["auth_session"];
        if (authCookie == "admin_session_token")
        {
            return Ok(new { IsAuthenticated = true, Username = "admin" });
        }
        return Unauthorized(new { IsAuthenticated = false });
    }
}
