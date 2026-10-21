import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { createTeamModel } from "../models/team";

/**
 * @namespace lbs.videomanager.team.controllers
 */
export default class Team extends Controller {
    private model!: JSONModel;

    public onInit(): void {
        this.model = createTeamModel();
        this.getView()!.setModel(this.model, "team");
    }

    public onExit(): void {
        this.model.destroy();
    }
}
