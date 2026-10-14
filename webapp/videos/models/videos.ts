import JSONModel from "sap/ui/model/json/JSONModel";

export interface Video {
    id: string;
    title: string;
    topic: string;
    language: "DE" | "EN";
    year: number;
    durationSeconds: number;
    duration: string;
    thumbnail: string;
    url: string;
}

export function createVideosModel(): JSONModel {
    const model = new JSONModel({
        items: [],
        query: "",
        topic: "",
        language: "",
        visibleCount: 0,
        topics: [{ key: "", text: "Alle Themen" }],
        busy: false,
        error: "",
        uploading: false,
        preparing: false,
        progress: 0,
        uploadError: "",
        selected: null,
        playbackError: "",
        form: { title: "", topic: "", language: "DE", year: new Date().getFullYear() }
    });

    model.setSizeLimit(10000);
    return model;
}
