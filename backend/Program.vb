Imports System.IO
Imports Microsoft.AspNetCore.Hosting
Imports Microsoft.AspNetCore.Builder
Imports Microsoft.AspNetCore.Http
Imports Microsoft.AspNetCore.Http.Features
Imports Microsoft.AspNetCore.StaticFiles
Imports Microsoft.Extensions.DependencyInjection
Imports Microsoft.Extensions.FileProviders
Imports Microsoft.Extensions.Hosting
Imports Lernvideo.Services

Module Program
    Sub Main(args As String())
        Dim builder = WebApplication.CreateBuilder(args)
        builder.WebHost.ConfigureKestrel(Sub(options) options.Limits.MaxRequestBodySize = 270L * 1024 * 1024)
        builder.Services.Configure(Of FormOptions)(Sub(options) options.MultipartBodyLengthLimit = 270L * 1024 * 1024)
        builder.Services.AddControllers()
        builder.Services.AddSingleton(Of VideoStore)()
        builder.Services.AddCors(Sub(options)
            options.AddDefaultPolicy(Sub(policy)
                policy.WithOrigins("http://localhost:8081", "http://127.0.0.1:8081").WithMethods("GET", "POST", "DELETE").WithHeaders("Content-Type", "X-VideoManager-Request")
            End Sub)
        End Sub)

        Dim app = builder.Build()
        app.UseCors()
        ' Custom header prevents uploads/deletes through unrelated websites' HTML forms.
        app.Use(New Func(Of HttpContext, RequestDelegate, Task)(Async Function(context, nextHandler)
            context.Response.Headers("X-Content-Type-Options") = "nosniff"
            If context.Request.Path.StartsWithSegments("/api") AndAlso
                (HttpMethods.IsPost(context.Request.Method) OrElse HttpMethods.IsDelete(context.Request.Method)) AndAlso
                context.Request.Headers("X-VideoManager-Request").ToString() <> "1" Then
                context.Response.StatusCode = 403
                Await context.Response.WriteAsJsonAsync(New With {.message = "Diese Anfrage ist nicht erlaubt."})
                Return
            End If
            Await nextHandler(context)
        End Function))

        Dim webRoot = Path.Combine(app.Environment.ContentRootPath, "wwwroot")
        If Not Directory.Exists(webRoot) Then webRoot = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "dist"))
        If Directory.Exists(webRoot) Then
            Dim provider = New PhysicalFileProvider(webRoot)
            Dim contentTypes = New FileExtensionContentTypeProvider()
            contentTypes.Mappings(".properties") = "text/plain; charset=utf-8"
            app.UseDefaultFiles(New DefaultFilesOptions With {.FileProvider = provider})
            app.UseStaticFiles(New StaticFileOptions With {.FileProvider = provider, .ContentTypeProvider = contentTypes})
        End If
        app.MapControllers()
        app.Run()
    End Sub
End Module
