import { setStudents } from "./js/app.js";
import { loadAllStudents } from "./js/api.js";
import { renderStudentList } from "./js/ui.js";
import { initializeEvents, initializeSaveButton } from "./js/events.js";
import { goToStudent } from "./js/navigation.js";
import {

    initializeNavigation

}

from "./js/events.js";
import { initializeSearch } from "./js/search.js";
import { updateProgress } from "./js/progress.js";
import { initializeAI } from "./js/ai.js";

async function init() {

    const students = await loadAllStudents();

    setStudents(students);

    initializeEvents();

    initializeSaveButton();

    initializeNavigation();

    initializeSearch();

    renderStudentList(
        students,
        goToStudent
    );

    updateProgress();

    initializeAI();

    if (students.length) {

        await goToStudent(
            students[0]
        );

    }

}

init();