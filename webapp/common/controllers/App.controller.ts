import Controller from "sap/ui/core/mvc/Controller";
import Device from "sap/ui/Device";
import ToggleButton from "sap/m/ToggleButton";
import VBox from "sap/m/VBox";
import UIComponent from "sap/ui/core/UIComponent";
import { Router$RoutePatternMatchedEvent } from "sap/ui/core/routing/Router";

/**
  * @namespace lbs.videomanager.common.controllers
  */
export default class App extends Controller {
    public onInit(): void {
        this.setMenuVisible(Device.resize.width >= 900);
        UIComponent.getRouterFor(this)!.attachRoutePatternMatched(this.onRouteMatched, this);
    }

    public onHome(): void {
        this.navigateTo("home");
    }

    public onVideos(): void {
        this.navigateTo("videos");
    }

    private navigateTo(route: string): void {
        this.selectNavigation(route);
        UIComponent.getRouterFor(this)!.navTo(route);

        if (Device.resize.width < 900) {
            this.setMenuVisible(false);
        }
    }

    private onRouteMatched(event: Router$RoutePatternMatchedEvent): void {
        this.selectNavigation(event.getParameter("name") ?? "home");
    }

    private selectNavigation(route: string): void {
        (this.byId("homeNavigation") as ToggleButton).setPressed(route === "home");
        (this.byId("videosNavigation") as ToggleButton).setPressed(route === "videos");
    }

    public onToggleMenu(): void {
        const navigation = this.byId("navigation") as VBox;

        this.setMenuVisible(!navigation.getVisible());
    }

    private setMenuVisible(visible: boolean): void {
        (this.byId("navigation") as VBox).setVisible(visible);

        (this.byId("menuButton") as ToggleButton)
            .setPressed(visible)
            .setTooltip(visible ? "Menü schließen" : "Menü öffnen");
    }

    public onExit(): void {
        UIComponent.getRouterFor(this)!.detachRoutePatternMatched(this.onRouteMatched, this);
    }
}
