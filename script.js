import { setStudents } from "./js/app.js";
import { loadAllStudents } from "./js/api.js";
import { renderStudentList } from "./js/ui.js";
import { initializeEvents, initializeSaveButton } from "./js/events.js";
import { goToStudent } from "./js/navigation.js";

async function init() {

    const students = await loadAllStudents();

    setStudents(students);

    initializeEvents();

    initializeSaveButton();

    renderStudentList(
        students,
        goToStudent
    );

    if (students.length) {

        await goToStudent(
            students[0]
        );

    }

}

init();