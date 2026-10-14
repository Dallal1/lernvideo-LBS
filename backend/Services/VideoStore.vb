Imports System.IO
Imports System.Text.Json
Imports System.Threading
Imports Microsoft.AspNetCore.Hosting
Imports Microsoft.AspNetCore.Http
Imports Microsoft.Extensions.Configuration
Imports Lernvideo.Models

Namespace Services
    Public Class VideoStore
        Public Const MaxVideoBytes As Long = 256L * 1024 * 1024
        Private ReadOnly _root As String
        Private ReadOnly _gate As New SemaphoreSlim(1, 1)
        Private ReadOnly _json As New JsonSerializerOptions(JsonSerializerDefaults.Web)

        Public Sub New(environment As IWebHostEnvironment, configuration As IConfiguration)
            Dim configured = configuration("Storage:Path")
            _root = Path.GetFullPath(If(String.IsNullOrWhiteSpace(configured), Path.Combine(environment.ContentRootPath, "uploads"), configured))
            Directory.CreateDirectory(_root)
        End Sub

        Public Async Function ListAsync() As Task(Of List(Of Video))
            Await _gate.WaitAsync()
            Try
                Dim videos As New List(Of Video)
                For Each folder In Directory.EnumerateDirectories(_root)
                    Dim id As Guid
                    If Not Guid.TryParseExact(Path.GetFileName(folder), "N", id) Then Continue For
                    Dim metadata = ReadMetadata(folder)
                    If metadata IsNot Nothing Then videos.Add(metadata)
                Next
                Return videos.OrderByDescending(Function(video) video.CreatedAt).ToList()
            Finally
                _gate.Release()
            End Try
        End Function

        Public Async Function SaveAsync(input As UploadVideo, cancellation As CancellationToken) As Task(Of Video)
            If String.IsNullOrWhiteSpace(input.Title) OrElse String.IsNullOrWhiteSpace(input.Topic) Then
                Throw New InvalidDataException("Bitte Titel und Thema ausfüllen.")
            End If
            If Not Double.IsFinite(input.DurationSeconds) Then Throw New InvalidDataException("Die Videodauer ist ungültig.")
            If input.VideoFile.Length < 12 OrElse input.VideoFile.Length > MaxVideoBytes Then
                Throw New InvalidDataException("Das Video muss zwischen 12 Bytes und 256 MB groß sein.")
            End If
            Dim extension = Path.GetExtension(input.VideoFile.FileName).ToLowerInvariant()
            Dim header = ReadHeader(input.VideoFile)
            Dim isMp4 = extension = ".mp4" AndAlso System.Text.Encoding.ASCII.GetString(header, 4, 4) = "ftyp"
            Dim isWebm = extension = ".webm" AndAlso header.Take(4).SequenceEqual(New Byte() {&H1A, &H45, &HDF, &HA3})
            If Not isMp4 AndAlso Not isWebm Then Throw New InvalidDataException("Nur MP4- und WebM-Videodateien sind erlaubt.")
            If input.ThumbnailFile.Length < 24 OrElse input.ThumbnailFile.Length > 2 * 1024 * 1024 OrElse
                Not ReadHeader(input.ThumbnailFile).Take(8).SequenceEqual(New Byte() {137, 80, 78, 71, 13, 10, 26, 10}) Then
                Throw New InvalidDataException("Die automatisch erzeugte Vorschau ist ungültig.")
            End If

            Dim video As New Video With {
                .Id = Guid.NewGuid().ToString("N"), .Title = input.Title.Trim(), .Topic = input.Topic.Trim(),
                .Language = input.Language, .Year = input.Year, .DurationSeconds = input.DurationSeconds,
                .Format = If(isMp4, "mp4", "webm")
            }
            Dim staging = Path.Combine(_root, ".pending-" & video.Id)
            Dim destination = Path.Combine(_root, video.Id)
            Directory.CreateDirectory(staging)
            Try
                Using output = New FileStream(Path.Combine(staging, "video." & video.Format), FileMode.CreateNew, FileAccess.Write, FileShare.None, 65536, True)
                    Await input.VideoFile.CopyToAsync(output, cancellation)
                End Using
                Using output = New FileStream(Path.Combine(staging, "thumbnail.png"), FileMode.CreateNew, FileAccess.Write, FileShare.None, 65536, True)
                    Await input.ThumbnailFile.CopyToAsync(output, cancellation)
                End Using
                Await System.IO.File.WriteAllTextAsync(Path.Combine(staging, "metadata.json"), JsonSerializer.Serialize(video, _json), cancellation)
                ' Publish complete uploads atomically; incomplete uploads never enter the list.
                Await _gate.WaitAsync(cancellation)
                Try
                    Directory.Move(staging, destination)
                Finally
                    _gate.Release()
                End Try
                Return video
            Finally
                If Directory.Exists(staging) Then Directory.Delete(staging, True)
            End Try
        End Function

        Public Async Function OpenAsync(id As String, thumbnail As Boolean) As Task(Of (Stream As FileStream, ContentType As String))
            Await _gate.WaitAsync()
            Try
                Dim folder = VideoFolder(id)
                Dim video = ReadMetadata(folder)
                If video Is Nothing Then Return (Nothing, "")
                Dim filename = If(thumbnail, "thumbnail.png", "video." & video.Format)
                Dim stream = New FileStream(Path.Combine(folder, filename), FileMode.Open, FileAccess.Read, FileShare.Read Or FileShare.Delete, 65536, True)
                Return (stream, If(thumbnail, "image/png", If(video.Format = "mp4", "video/mp4", "video/webm")))
            Catch ex As FileNotFoundException
                Return (Nothing, "")
            Catch ex As DirectoryNotFoundException
                Return (Nothing, "")
            Finally
                _gate.Release()
            End Try
        End Function

        Public Async Function DeleteAsync(id As String) As Task(Of Boolean)
            Await _gate.WaitAsync()
            Try
                Dim folder = VideoFolder(id)
                If Not Directory.Exists(folder) Then Return False
                ' Rename first so list/stream requests cannot observe a partially deleted video.
                Dim tombstone = Path.Combine(_root, ".deleted-" & id)
                Directory.Move(folder, tombstone)
                Try
                    Directory.Delete(tombstone, True)
                Catch
                    If Directory.Exists(tombstone) Then Directory.Move(tombstone, folder)
                    Throw
                End Try
                Return True
            Finally
                _gate.Release()
            End Try
        End Function

        Private Function VideoFolder(id As String) As String
            Dim parsed As Guid
            If Not Guid.TryParseExact(id, "N", parsed) Then Throw New InvalidDataException("Ungültige Video-ID.")
            Return Path.Combine(_root, parsed.ToString("N"))
        End Function

        Private Function ReadMetadata(folder As String) As Video
            Dim filename = Path.Combine(folder, "metadata.json")
            If Not System.IO.File.Exists(filename) Then Return Nothing
            Return JsonSerializer.Deserialize(Of Video)(System.IO.File.ReadAllText(filename), _json)
        End Function

        Private Shared Function ReadHeader(file As IFormFile) As Byte()
            Dim header(11) As Byte
            Using stream = file.OpenReadStream()
                stream.ReadExactly(header)
            End Using
            Return header
        End Function
    End Class
End Namespace
