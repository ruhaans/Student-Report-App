import { App } from "./app.js";
import { getStudentStatus } from "./ui.js";

export function updateProgress(){

    const completed =
        App.students.filter(student=>{

            return getStudentStatus(student)
                === "completed";

        }).length;

    const total =
        App.students.length;

    const percent =
        total === 0
        ? 0
        : Math.round(
            completed * 100 / total
        );

    document.getElementById(
        "progressFill"
    ).style.width =
        `${percent}%`;

    document.getElementById(
        "progressPercent"
    ).textContent =
        `${percent}%`;

    document.getElementById(
        "progressText"
    ).textContent =
        `${completed} / ${total} Completed`;

}