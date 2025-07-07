var builder = WebApplication.CreateBuilder(args);

// 1) CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2) Swagger (Swashbuckle)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "FreyrFund API",
        Version = "v1"
    });
});

// 3) Controllers (se houver)
builder.Services.AddControllers();

var app = builder.Build();

// 4) Swagger UI — force para sempre subir, ou ao menos garanta que esteja em Development
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FreyrFund API v1");
});

app.UseHttpsRedirection();
app.UseCors("AllowAngularDev");

// 5) Seu endpoint Test
app.MapGet("/Test", () => Results.Ok(new { message = "API funciona!" }))
   .WithName("Test")
   .WithOpenApi();

// 6) WeatherForecast (exemplo existente)
app.MapGet("/weatherforecast", () =>
{
    var summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild",
        "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        )
    ).ToArray();

    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

// Modelo do forecast
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
