import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace lbs.videomanager.team.controls
 */
export default class Portrait extends Control {
    public static readonly metadata = {
        properties: {
            photo: { type: "string", defaultValue: "" },
            person: { type: "string", defaultValue: "" },
            description: { type: "string", defaultValue: "" }
        }
    };

    public static readonly renderer = {
        apiVersion: 2,
        render(rm: RenderManager, control: Portrait): void {
            const descriptionId = `${control.getId()}-description`;
            rm.openStart("button", control);
            rm.class("teamPortrait");
            rm.attr("type", "button");
            rm.attr("aria-label", `Beschreibung von ${control.getProperty("person")}`);
            rm.attr("aria-describedby", descriptionId);
            rm.attr("aria-expanded", "false");
            rm.openEnd();

            rm.voidStart("img");
            rm.class("teamPortraitImage");
            rm.attr("src", control.getProperty("photo") as string);
            rm.attr("alt", `Porträt von ${control.getProperty("person")}`);
            rm.attr("draggable", "false");
            rm.voidEnd();

            rm.openStart("span", descriptionId);
            rm.class("teamStory");
            rm.openEnd();
            rm.text(control.getProperty("description") as string);
            rm.close("span");
            rm.close("button");
        }
    };

    public onclick(): void {
        const button = this.getDomRef();
        const expanded = button?.classList.toggle("teamStoryOpen") ?? false;
        button?.setAttribute("aria-expanded", String(expanded));
    }

    public onkeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            this.closeStory();
            (this.getDomRef() as HTMLElement | null)?.blur();
        }
    }

    public onfocusout(): void {
        this.closeStory();
    }

    private closeStory(): void {
        this.getDomRef()?.classList.remove("teamStoryOpen");
        this.getDomRef()?.setAttribute("aria-expanded", "false");
    }
}
