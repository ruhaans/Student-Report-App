import { selectStudent, App } from "./app.js";
import { updateStudentForm } from "./ui.js";
import { saveCurrentStudent } from "./save.js";

export async function goToStudent(student) {

    const ok = await saveCurrentStudent();

    if (!ok) return;

    const current = selectStudent(student.srNo);

    updateStudentForm(current);

}

export async function nextStudent() {

    if (App.currentIndex >= App.students.length - 1)
        return;

    await goToStudent(
        App.students[App.currentIndex + 1]
    );

}

export async function previousStudent() {

    if (App.currentIndex <= 0)
        return;

    await goToStudent(
        App.students[App.currentIndex - 1]
    );

}