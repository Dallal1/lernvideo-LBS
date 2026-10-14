import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import FlexBox from "sap/m/FlexBox";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";
import FileUploader, { FileUploader$ChangeEvent } from "sap/ui/unified/FileUploader";
import Player from "../controls/Player";
import { listVideos, uploadVideo, deleteVideo } from "../services/api";
import { prepareVideo, PreparedVideo } from "../services/prepareVideo";
import { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import { createVideosModel, Video } from "../models/videos";

/**
 * @namespace lbs.videomanager.videos.controllers
 */
export default class Videos extends Controller {
    private model!: JSONModel;
    private request?: AbortController;
    private uploadDialog?: Promise<Dialog>;
    private playbackDialog?: Promise<Dialog>;
    private prepared?: PreparedVideo;
    private selectionVersion = 0;

    public onInit(): void {
        this.model = createVideosModel();
        this.getView()!.setModel(this.model, "videos");
        void this.reload();
    }

    public onSearch(event: SearchField$LiveChangeEvent): void {
        const model = this.getView()!.getModel("videos") as JSONModel;

        model.setProperty("/query", event.getParameter("newValue"));
        this.onFilter();
    }

    public onFilter(): void {
        const model = this.getView()!.getModel("videos") as JSONModel;
        const query = (model.getProperty("/query") as string).trim();
        const topic = model.getProperty("/topic") as string;
        const language = model.getProperty("/language") as string;
        const filters: Filter[] = [];

        if (query) {
            filters.push(new Filter({
                path: "title",
                operator: FilterOperator.Contains,
                value1: query,
                caseSensitive: false
            }));
        }

        if (topic) {
            filters.push(new Filter("topic", FilterOperator.EQ, topic));
        }

        if (language) {
            filters.push(new Filter("language", FilterOperator.EQ, language));
        }

        const grid = this.byId("videoGrid") as FlexBox;
        const binding = grid.getBinding("items") as ListBinding;

        binding.filter(filters.length ? [new Filter({ filters, and: true })] : []);
        model.setProperty("/visibleCount", binding.getLength());
    }

    public onReload(): void {
        void this.reload();
    }

    private async reload(): Promise<void> {
        this.request?.abort();
        const request = new AbortController();
        this.request = request;
        this.model.setProperty("/busy", true);
        this.model.setProperty("/error", "");
        try {
            const videos = await listVideos(request.signal);
            this.model.setProperty("/items", videos);
            const topics = [...new Set(videos.map((video) => video.topic))].sort();
            this.model.setProperty("/topics", [
                { key: "", text: "Alle Themen" },
                ...topics.map((topic) => ({ key: topic, text: topic }))
            ]);
            if (!topics.includes(this.model.getProperty("/topic") as string)) {
                this.model.setProperty("/topic", "");
            }
            this.onFilter();
        } catch {
            if (!request.signal.aborted) {
                this.model.setProperty("/error", "Die Videos konnten nicht geladen werden. Prüfe die Verbindung zum Videoserver und klicke auf Neu laden.");
            }
        } finally {
            if (!request.signal.aborted) this.model.setProperty("/busy", false);
        }
    }

    public async onUpload(): Promise<void> {
        this.prepared = undefined;
        this.selectionVersion++;
        this.model.setProperty("/form", { title: "", topic: "", language: "DE", year: new Date().getFullYear() });
        this.model.setProperty("/uploadError", "");
        this.model.setProperty("/preparing", false);
        this.uploadDialog ??= this.loadFragment({ name: "lbs.videomanager.videos.views.Upload" }) as Promise<Dialog>;
        const dialog = await this.uploadDialog;
        dialog.setEscapeHandler((promise) => {
            if (this.model.getProperty("/uploading")) promise.reject();
            else {
                this.selectionVersion++;
                this.prepared = undefined;
                promise.resolve();
            }
        });
        (this.byId("videoFile") as FileUploader).clear();
        dialog.open();
    }

    public async onFileChange(event: FileUploader$ChangeEvent): Promise<void> {
        const version = ++this.selectionVersion;
        this.prepared = undefined;
        this.model.setProperty("/uploadError", "");
        this.model.setProperty("/preparing", false);
        const files = event.getParameter("files") as File[];
        if (!files?.length) return;
        this.model.setProperty("/preparing", true);
        try {
            const prepared = await prepareVideo(files[0]);
            if (version !== this.selectionVersion) return;
            this.prepared = prepared;
            if (!this.model.getProperty("/form/title")) {
                this.model.setProperty("/form/title", files[0].name.replace(/\.[^.]+$/, "").slice(0, 120));
            }
        } catch (error) {
            if (version === this.selectionVersion) this.model.setProperty("/uploadError", (error as Error).message);
        } finally {
            if (version === this.selectionVersion) this.model.setProperty("/preparing", false);
        }
    }

    public onInvalidFile(): void {
        this.selectionVersion++;
        this.prepared = undefined;
        this.model.setProperty("/preparing", false);
        this.model.setProperty("/uploadError", "Bitte eine MP4- oder WebM-Datei mit maximal 256 MB auswählen.");
    }

    public async onSaveUpload(): Promise<void> {
        if (this.model.getProperty("/uploading")) return;
        const form = this.model.getProperty("/form") as { title: string; topic: string; language: string; year: number | string };
        const year = Number(form.year);
        if (!this.prepared || !form.title.trim() || !form.topic.trim() || !Number.isInteger(year) || year < 1900 || year > 2100) {
            this.model.setProperty("/uploadError", "Bitte Video, Titel, Thema und ein gültiges Jahr (1900–2100) angeben.");
            return;
        }
        const data = new FormData();
        data.append("title", form.title.trim());
        data.append("topic", form.topic.trim());
        data.append("language", form.language);
        data.append("year", String(year));
        data.append("durationSeconds", String(this.prepared.duration));
        data.append("videoFile", this.prepared.file);
        data.append("thumbnailFile", this.prepared.thumbnail, "thumbnail.png");
        this.model.setProperty("/uploading", true);
        this.model.setProperty("/progress", 0);
        this.model.setProperty("/uploadError", "");
        try {
            await uploadVideo(data, (percent) => this.model.setProperty("/progress", percent));
            (await this.uploadDialog!).close();
            this.prepared = undefined;
            this.model.setProperty("/query", "");
            this.model.setProperty("/topic", "");
            this.model.setProperty("/language", "");
            MessageToast.show("Video wurde gespeichert.");
            await this.reload();
        } catch (error) {
            this.model.setProperty("/uploadError", (error as Error).message);
        } finally {
            this.model.setProperty("/uploading", false);
        }
    }

    public async onCancelUpload(): Promise<void> {
        this.selectionVersion++;
        this.prepared = undefined;
        (await this.uploadDialog!).close();
    }

    public async onWatch(event: Event): Promise<void> {
        const video = (event.getSource() as Button).getBindingContext("videos")!.getObject() as Video;
        this.model.setProperty("/selected", video);
        this.model.setProperty("/playbackError", "");
        this.playbackDialog ??= this.loadFragment({ name: "lbs.videomanager.videos.views.Playback" }) as Promise<Dialog>;
        (await this.playbackDialog).open();
    }

    public onPlaybackError(): void {
        this.model.setProperty("/playbackError", "Das Video kann nicht abgespielt werden. Prüfe die Verbindung und ob dein Browser das Videoformat unterstützt.");
    }

    public async onClosePlayback(): Promise<void> {
        (await this.playbackDialog!).close();
    }

    public onPlaybackClosed(): void {
        (this.byId("player") as Player).stop();
        this.model.setProperty("/selected", null);
    }

    public onDelete(event: Event): void {
        const video = (event.getSource() as Button).getBindingContext("videos")!.getObject() as Video;
        MessageBox.confirm(`„${video.title}“ wirklich dauerhaft löschen?`, {
            title: "Video löschen",
            actions: ["Löschen", MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.CANCEL,
            onClose: (action: string | null) => {
                if (action === "Löschen") void this.removeVideo(video.id);
            }
        });
    }

    private async removeVideo(id: string): Promise<void> {
        this.model.setProperty("/busy", true);
        try {
            await deleteVideo(id);
            MessageToast.show("Video wurde gelöscht.");
            await this.reload();
        } catch (error) {
            MessageBox.error((error as Error).message);
        } finally {
            this.model.setProperty("/busy", false);
        }
    }

    public onExit(): void {
        this.request?.abort();
        this.selectionVersion++;
        this.prepared = undefined;
        this.model.destroy();
    }
}
