import JSONModel from "sap/ui/model/json/JSONModel";

// Testdaten: Alle drei Rollen verwenden vorerst dasselbe Foto.
// Die Beschreibungen sind Beispiele und können später ersetzt werden.
export function createTeamModel(): JSONModel {
    return new JSONModel({
        members: [
            {
                id: "developer",
                name: "Mohammad",
                position: "Software Developer",
                photo: "team/images/Personal_Image.png",
                description: "Ich entwickle die Oberfläche unserer Lernplattform und bringe Ideen mit Code zum Leben. Besonders wichtig sind mir eine klare Struktur und eine einfache Bedienung."
            },
            {
                id: "network",
                name: "Mohammad",
                position: "Network",
                photo: "team/images/Personal_Image.png",
                description: "Ich kümmere mich um die Verbindung zwischen unseren Systemen. Mein Schwerpunkt liegt auf Netzwerken, Servern und einer zuverlässigen technischen Umgebung."
            },
            {
                id: "leader",
                name: "Mohammad",
                position: "Team Leader",
                photo: "team/images/Personal_Image.png",
                description: "Ich behalte unsere gemeinsamen Ziele im Blick, koordiniere die Aufgaben und unterstütze das Team dabei, aus einzelnen Ideen ein gemeinsames Projekt zu machen."
            }
        ]
    });
}
