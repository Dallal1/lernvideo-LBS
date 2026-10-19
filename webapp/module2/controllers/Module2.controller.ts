import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import SearchField, { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import Select from "sap/m/Select";
import MessageToast from "sap/m/MessageToast";
import { createCatalogModel, CatalogVideo } from "../models/catalog";

/**
 * @namespace lbs.videomanager.module2.controllers
 */
export default class Module2 extends Controller {
    private catalog!: JSONModel;
    private source!: JSONModel;
    private entries: CatalogVideo[] = [];

    public onInit(): void {
        this.catalog = createCatalogModel();
        this.getView()!.setModel(this.catalog, "catalog");
        this.source = new JSONModel();
        this.source.attachRequestCompleted(() => {
            this.catalog.setProperty("/busy", false);
            const items = this.source.getProperty("/items");

            if (!Array.isArray(items)) {
                this.catalog.setProperty("/error", "Der Videokatalog konnte nicht geladen werden. Bitte lade die Seite neu.");
                return;
            }

            this.entries = items as CatalogVideo[];
            this.catalog.setProperty("/credits", this.entries);
            const topics = [...new Set(this.entries.map(video => video.topic))].sort();
            this.catalog.setProperty("/topics", [
                { key: "", text: "Alle Themen" },
                ...topics.map(topic => ({ key: topic, text: topic }))
            ]);
            this.applyFilters();
        });
        void this.source.loadData(sap.ui.require.toUrl("lbs/videomanager/module2/models/catalog.json"))?.catch(() => {
            this.catalog.setProperty("/busy", false);
            this.catalog.setProperty("/error", "Der Videokatalog konnte nicht geladen werden. Bitte lade die Seite neu.");
        });
    }

    public onSearch(event: SearchField$LiveChangeEvent): void {
        this.catalog.setProperty("/query", event.getParameter("newValue") ?? "");
        this.applyFilters();
    }

    public onFilter(): void {
        this.catalog.setProperty("/query", (this.byId("videoSearch") as SearchField).getValue());
        this.catalog.setProperty("/topic", (this.byId("topicFilter") as Select).getSelectedKey());
        this.catalog.setProperty("/language", (this.byId("languageFilter") as Select).getSelectedKey());
        this.applyFilters();
    }

    private applyFilters(): void {
        const query = String(this.catalog.getProperty("/query")).trim().toLocaleLowerCase("de");
        const topic = this.catalog.getProperty("/topic");
        const language = this.catalog.getProperty("/language");
        const items = this.entries.filter(video => {
            const text = `${video.title} ${video.description} ${video.topic}`.toLocaleLowerCase("de");
            return (!query || text.includes(query))
                && (!topic || video.topic === topic)
                && (!language || video.language === language);
        });

        this.catalog.setProperty("/items", items);
        this.catalog.setProperty("/visibleCount", items.length);
    }

    public onWatch(): void {
        // Jellyfin integration belongs here; videoUrl remains the original source link.
        MessageToast.show("Dieses Video ist bald verfügbar.");
    }

    public onExit(): void {
        this.source.destroy();
        this.catalog.destroy();
    }
}
