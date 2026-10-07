import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import FlexBox from "sap/m/FlexBox";
import MessageToast from "sap/m/MessageToast";
import { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import { createVideosModel } from "../models/videos";

/**
 * @namespace lbs.videomanager.videos.controllers
 */
export default class Videos extends Controller {
    public onInit(): void {
        this.getView()!.setModel(createVideosModel(), "videos");
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

    public onUpload(): void {
        MessageToast.show("Demo: Hochladen ist noch nicht verfügbar.");
    }

    public onWatch(): void {
        MessageToast.show("Demo: Die Videowiedergabe ist noch nicht verfügbar.");
    }

    public onDelete(): void {
        MessageToast.show("Demo: Löschen ist noch nicht verfügbar. Es wurde nichts geändert.");
    }

    public onExit(): void {
        this.getView()!.getModel("videos")?.destroy();
    }
}
