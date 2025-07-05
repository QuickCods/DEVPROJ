var builder = WebApplication.CreateBuilder(args);

// 1) Registar política CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2) Adicionar Swagger/OpenAPI (opcional)
builder.Services.AddOpenApi();

var app = builder.Build();

// 3) Configurar pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();          // Swagger UI em Development
}

app.UseHttpsRedirection();    // Redireciona HTTP→HTTPS

app.UseCors("AllowAngularDev"); // *** Aplica aqui a política CORS ***

// Endpoint de exemplo
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
.WithName("GetWeatherForecast");

app.Run();

// Modelo do forecast
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}