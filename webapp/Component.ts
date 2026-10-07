import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace lbs.videomanager
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json",
    interfaces: ["sap.ui.core.IAsyncContentCreation"]
  };

  public init(): void {
    super.init();
    this.getRouter().initialize();
  }
}
