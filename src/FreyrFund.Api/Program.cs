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

app.MapControllers();    


app.Run();


