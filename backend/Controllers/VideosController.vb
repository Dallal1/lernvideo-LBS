Imports System.IO
Imports Microsoft.AspNetCore.Mvc
Imports Lernvideo.Models
Imports Lernvideo.Services

Namespace Controllers
    <ApiController, Route("api/videos")>
    Public Class VideosController
        Inherits ControllerBase

        Private ReadOnly _store As VideoStore

        Public Sub New(store As VideoStore)
            _store = store
        End Sub

        <HttpGet>
        Public Async Function List() As Task(Of IActionResult)
            Response.Headers("Cache-Control") = "no-store"
            Return Ok(Await _store.ListAsync())
        End Function

        <HttpPost>
        Public Async Function Upload(<FromForm> input As UploadVideo) As Task(Of IActionResult)
            Try
                Dim video = Await _store.SaveAsync(input, HttpContext.RequestAborted)
                Return Created(video.Url, video)
            Catch ex As InvalidDataException
                Return BadRequest(New With {.message = ex.Message})
            End Try
        End Function

        <HttpGet("{id}/stream")>
        Public Async Function Stream(id As String) As Task(Of IActionResult)
            Return Await ReadFile(id, False)
        End Function

        <HttpGet("{id}/thumbnail")>
        Public Async Function Thumbnail(id As String) As Task(Of IActionResult)
            Return Await ReadFile(id, True)
        End Function

        Private Async Function ReadFile(id As String, thumbnail As Boolean) As Task(Of IActionResult)
            Try
                Dim media = Await _store.OpenAsync(id, thumbnail)
                If media.Stream Is Nothing Then Return NotFound(New With {.message = "Das Video wurde nicht gefunden."})
                Return File(media.Stream, media.ContentType, enableRangeProcessing:=True)
            Catch ex As InvalidDataException
                Return NotFound()
            End Try
        End Function

        <HttpDelete("{id}")>
        Public Async Function Delete(id As String) As Task(Of IActionResult)
            Try
                If Not Await _store.DeleteAsync(id) Then Return NotFound(New With {.message = "Das Video wurde bereits gelöscht."})
                Return NoContent()
            Catch ex As InvalidDataException
                Return NotFound()
            End Try
        End Function
    End Class
End Namespace
