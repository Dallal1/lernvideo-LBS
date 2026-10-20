import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { createTeamModel } from "../models/team";

/**
 * @namespace lbs.videomanager.team.controllers
 */
export default class Team extends Controller {
    private model!: JSONModel;
    private frame = 0;
    private pointerX = 0;
    private pointerY = 0;
    private motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    public onInit(): void {
        this.model = createTeamModel();
        this.getView()!.setModel(this.model, "team");
    }

    public onBeforeRendering(): void {
        this.detachPointer();
    }

    public onAfterRendering(): void {
        document.addEventListener("pointermove", this.onPointerMove);
        document.documentElement.addEventListener("pointerleave", this.resetPortraits);
        window.addEventListener("blur", this.resetPortraits);
        this.motionPreference.addEventListener("change", this.resetPortraits);
    }

    private onPointerMove = (event: PointerEvent): void => {
        if (event.pointerType === "touch" || this.motionPreference.matches) {
            return;
        }

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;

        if (!this.frame) {
            this.frame = window.requestAnimationFrame(this.updatePortraits);
        }
    };

    private updatePortraits = (): void => {
        this.frame = 0;
        const images = this.getView()?.getDomRef()?.querySelectorAll<HTMLElement>(".teamPortraitImage");
        images?.forEach(image => {
            const bounds = image.parentElement!.getBoundingClientRect();
            const x = Math.max(-1, Math.min(1, (this.pointerX - bounds.left - bounds.width / 2) / 500));
            const y = Math.max(-1, Math.min(1, (this.pointerY - bounds.top - bounds.height / 2) / 500));
            image.style.transform = `perspective(900px) translate(${x * 5}px, ${y * 5}px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) scale(1.05)`;
        });
    };

    private resetPortraits = (): void => {
        window.cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.getView()?.getDomRef()?.querySelectorAll<HTMLElement>(".teamPortraitImage").forEach(image => {
            image.style.removeProperty("transform");
        });
    };

    private detachPointer(): void {
        document.removeEventListener("pointermove", this.onPointerMove);
        document.documentElement.removeEventListener("pointerleave", this.resetPortraits);
        window.removeEventListener("blur", this.resetPortraits);
        this.motionPreference.removeEventListener("change", this.resetPortraits);
        this.resetPortraits();
    }

    public onExit(): void {
        this.detachPointer();
        this.model.destroy();
    }
}
