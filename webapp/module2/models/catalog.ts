import JSONModel from "sap/ui/model/json/JSONModel";

export interface CatalogVideo {
    id: string;
    title: string;
    description: string;
    topic: string;
    language: "DE" | "EN";
    thumbnail: string;
    videoUrl: string;
    sourceUrl: string;
    jellyfinUrl: string;
}

export function createCatalogModel(): JSONModel {
    return new JSONModel({
        items: [],
        credits: [],
        query: "",
        topic: "",
        language: "",
        topics: [{ key: "", text: "Alle Themen" }],
        visibleCount: 0,
        busy: true,
        error: ""
    });
}
