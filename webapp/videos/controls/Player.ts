import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace lbs.videomanager.videos.controls
 */
export default class Player extends Control {
    public static metadata = {
        properties: {
            source: { type: "string", defaultValue: "" },
            poster: { type: "string", defaultValue: "" }
        },
        events: { playbackError: {} }
    };

    public static renderer = {
        apiVersion: 2,
        render(manager: RenderManager, control: Player): void {
            manager.openStart("video", control)
                .class("actualVideoPlayer")
                .attr("controls", "")
                .attr("playsinline", "")
                .attr("preload", "metadata")
                .attr("aria-label", "Videowiedergabe");
            const source = control.getProperty("source") as string;
            if (source) manager.attr("src", source);
            const poster = control.getProperty("poster") as string;
            if (poster) manager.attr("poster", poster);
            manager.openEnd().close("video");
        }
    };

    public onAfterRendering(): void {
        const video = this.getDomRef() as HTMLVideoElement | null;
        if (video) video.onerror = () => this.fireEvent("playbackError");
    }

    public stop(): void {
        const video = this.getDomRef() as HTMLVideoElement | null;
        if (video) {
            video.onerror = null;
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
    }

    public exit(): void {
        this.stop();
    }
}
