import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";

/**
  * @namespace lbs.videomanager.home.controllers
  */
export default class Home extends Controller {
    public onOpenModule2(): void {
        UIComponent.getRouterFor(this)!.navTo("module2");
    }

    public onOpenTeam(): void {
        UIComponent.getRouterFor(this)!.navTo("team");
    }

    public onOpenVideos(): void {
        UIComponent.getRouterFor(this)!.navTo("videos");
    }
}
