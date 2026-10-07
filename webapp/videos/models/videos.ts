import JSONModel from "sap/ui/model/json/JSONModel";

export interface Video {
    id: string;
    title: string;
    topic: string;
    duration: string;
    language: "DE" | "EN";
    thumbnail: string;
}

// Nur Beispieldaten für die Oberfläche. Keine Videodateien oder Backend-Verbindung.
const sampleVideos: Video[] = [
    {
        id: "demo-ui5",
        title: "OpenUI5 Grundlagen",
        topic: "Programmierung",
        duration: "12:34",
        language: "DE",
        thumbnail: "videos/images/code.jpg"
    },
    {
        id: "demo-raspberry",
        title: "Raspberry Pi einrichten",
        topic: "Hardware",
        duration: "15:21",
        language: "DE",
        thumbnail: "videos/images/hardware.jpg"
    },
    {
        id: "demo-network",
        title: "Netzwerk Grundlagen",
        topic: "Netzwerke",
        duration: "10:18",
        language: "DE",
        thumbnail: "videos/images/network.jpg"
    },
    {
        id: "demo-linux",
        title: "Linux Terminal",
        topic: "Betriebssysteme",
        duration: "14:37",
        language: "DE",
        thumbnail: "videos/images/terminal.jpg"
    },
    {
        id: "demo-database",
        title: "Datenbanken verstehen",
        topic: "Datenbanken",
        duration: "11:26",
        language: "DE",
        thumbnail: "videos/images/database.svg"
    },
    {
        id: "demo-git",
        title: "Git und GitHub",
        topic: "Programmierung",
        duration: "16:05",
        language: "EN",
        thumbnail: "videos/images/git.jpg"
    }
];

export function createVideosModel(): JSONModel {
    const topics = [...new Set(sampleVideos.map((video) => video.topic))].sort();

    return new JSONModel({
        items: sampleVideos,
        query: "",
        topic: "",
        language: "",
        visibleCount: sampleVideos.length,
        topics: [
            { key: "", text: "Alle Themen" },
            ...topics.map((topic) => ({ key: topic, text: topic }))
        ]
    });
}
