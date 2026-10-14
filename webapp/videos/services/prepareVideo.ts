export interface PreparedVideo {
    file: File;
    thumbnail: Blob;
    duration: number;
}

// Read an actual frame in the browser; no server-side transcoding is needed on the Pi.
export function prepareVideo(file: File): Promise<PreparedVideo> {
    if (!/\.(mp4|webm)$/i.test(file.name)) {
        return Promise.reject(new Error("Bitte wähle eine MP4- oder WebM-Datei."));
    }
    if (file.size === 0 || file.size > 256 * 1024 * 1024) {
        return Promise.reject(new Error("Das Video darf nicht leer oder größer als 256 MB sein."));
    }

    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const url = URL.createObjectURL(file);
        let finished = false;
        const finish = (error?: Error, thumbnail?: Blob) => {
            if (finished) return;
            finished = true;
            const duration = video.duration;
            clearTimeout(timer);
            video.onloadeddata = null;
            video.onseeked = null;
            video.onerror = null;
            video.pause();
            video.removeAttribute("src");
            video.load();
            URL.revokeObjectURL(url);
            if (error) reject(error);
            else resolve({ file, thumbnail: thumbnail!, duration });
        };
        const timer = window.setTimeout(() => finish(new Error("Das Video konnte nicht gelesen werden. Bitte eine andere Datei versuchen.")), 30000);
        video.muted = true;
        video.preload = "auto";
        video.playsInline = true;
        video.onerror = () => finish(new Error("Dieses Video kann der Browser nicht abspielen. Bitte MP4 mit H.264/AAC oder WebM verwenden."));
        video.onloadeddata = () => {
            if (!Number.isFinite(video.duration) || video.duration <= 0 || video.duration > 86400 || !video.videoWidth) {
                finish(new Error("Ungültiges Video oder Dauer über 24 Stunden."));
                return;
            }
            video.currentTime = Math.min(1, video.duration / 2);
        };
        video.onseeked = () => {
            try {
                const canvas = document.createElement("canvas");
                const scale = Math.min(640 / video.videoWidth, 360 / video.videoHeight, 1);
                canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
                canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
                canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => blob
                    ? finish(undefined, blob)
                    : finish(new Error("Die Videovorschau konnte nicht erstellt werden.")), "image/png");
            } catch {
                finish(new Error("Die Videovorschau konnte nicht erstellt werden."));
            }
        };
        video.src = url;
    });
}
