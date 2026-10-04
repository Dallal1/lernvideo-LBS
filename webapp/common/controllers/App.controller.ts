import Controller from "sap/ui/core/mvc/Controller";
import Device from "sap/ui/Device";
import ToggleButton from "sap/m/ToggleButton";
import VBox from "sap/m/VBox";

/**
 * @namespace lbs.videomanager.common.controllers
 */
export default class App extends Controller {
  public onInit(): void {
    this.setMenuVisible(Device.resize.width >= 900);
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
}
