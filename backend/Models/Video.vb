Imports System.ComponentModel.DataAnnotations
Imports Microsoft.AspNetCore.Http

Namespace Models
    Public Class Video
        Public Property Id As String = ""
        Public Property Title As String = ""
        Public Property Topic As String = ""
        Public Property Language As String = "DE"
        Public Property Year As Integer
        Public Property DurationSeconds As Double
        Public Property Format As String = "mp4"
        Public Property CreatedAt As DateTimeOffset = DateTimeOffset.UtcNow

        Public ReadOnly Property Thumbnail As String
            Get
                Return $"/api/videos/{Id}/thumbnail"
            End Get
        End Property

        Public ReadOnly Property Url As String
            Get
                Return $"/api/videos/{Id}/stream"
            End Get
        End Property
    End Class

    Public Class UploadVideo
        <Required, StringLength(120)>
        Public Property Title As String = ""

        <Required, StringLength(60)>
        Public Property Topic As String = ""

        <Required, RegularExpression("^(DE|EN)$")>
        Public Property Language As String = "DE"

        <Range(1900, 2100)>
        Public Property Year As Integer

        <Range(0.01, 86400)>
        Public Property DurationSeconds As Double

        <Required>
        Public Property VideoFile As IFormFile

        <Required>
        Public Property ThumbnailFile As IFormFile
    End Class
End Namespace
