import { Video } from "../models/videos";

// UI5 development server and VB.NET run separately. Published builds use one origin.
const apiBase = window.location.port === "8081"
    ? `${window.location.protocol}//${window.location.hostname}:5080`
    : "";

export function mediaUrl(path: string): string {
    return apiBase + path;
}

export async function listVideos(signal?: AbortSignal): Promise<Video[]> {
    const response = await fetch(mediaUrl("/api/videos"), { signal, cache: "no-store" });
    if (!response.ok) throw new Error("Die Videoliste konnte nicht geladen werden.");

    const videos = await response.json() as Video[];
    return videos.map((video) => {
        const seconds = Math.floor(video.durationSeconds);
        const minutes = Math.floor(seconds / 60);
        return {
            ...video,
            duration: `${minutes}:${String(seconds % 60).padStart(2, "0")}`,
            thumbnail: mediaUrl(video.thumbnail),
            url: mediaUrl(video.url)
        };
    });
}

export async function deleteVideo(id: string): Promise<void> {
    const response = await fetch(mediaUrl(`/api/videos/${encodeURIComponent(id)}`), {
        method: "DELETE",
        headers: { "X-VideoManager-Request": "1" }
    });
    if (!response.ok && response.status !== 404) {
        throw new Error("Das Video konnte nicht gelöscht werden. Bitte erneut versuchen.");
    }
}

export function uploadVideo(data: FormData, progress: (percent: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("POST", mediaUrl("/api/videos"));
        request.setRequestHeader("X-VideoManager-Request", "1");
        request.timeout = 30 * 60 * 1000;
        request.upload.onprogress = (event) => {
            if (event.lengthComputable) progress(Math.round(event.loaded / event.total * 100));
        };
        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
                resolve();
                return;
            }
            let message = request.status === 413
                ? "Die Datei ist zu groß. Maximal 256 MB sind erlaubt."
                : "Hochladen fehlgeschlagen. Bitte prüfe die Eingaben und versuche es erneut.";
            try {
                const body = JSON.parse(request.responseText) as { message?: string };
                if (body.message) message = body.message;
            } catch { /* An HTTP error may not contain JSON. */ }
            reject(new Error(message));
        };
        request.onerror = () => reject(new Error("Keine Verbindung zum Videoserver. Bitte versuche es erneut."));
        request.ontimeout = () => reject(new Error("Zeitüberschreitung. Bitte lade die Liste neu, bevor du es erneut versuchst."));
        request.send(data);
    });
}
