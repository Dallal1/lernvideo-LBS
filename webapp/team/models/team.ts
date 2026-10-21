import JSONModel from "sap/ui/model/json/JSONModel";

export function createTeamModel(): JSONModel {
    return new JSONModel({
        members: [
            {
                id: "developer",
                name: "Dallal",
                position: "Software Developer"
            },
            {
                id: "leader",
                name: "Julia",
                position: "Team Leader"
            },
            {
                id: "Technical Leader",
                name: "Ashneet",
                position: "Technical Leader"
            }
        ]
    });
}
