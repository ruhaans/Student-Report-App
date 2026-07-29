import { App, selectStudent } from "./app.js";
import { updateStudentForm, updateStudentPosition } from "./ui.js";
import { saveCurrentStudent } from "./save.js";
import {highlightStudent } from "./ui.js";

export async function goToStudent(student){

    const saved = await saveCurrentStudent();

    if(!saved) return;

    const current = selectStudent(student.srNo);

    updateStudentForm(current);

    document
    .getElementById("introduction")
    .focus();

    highlightStudent(
    current.srNo
);

    updateStudentPosition(
        App.currentIndex,
        App.students.length
    );

}

export async function nextStudent(){

    if(App.currentIndex >= App.students.length - 1)
        return;

    await goToStudent(
        App.students[
            App.currentIndex + 1
        ]
    );

}

export async function previousStudent(){

    if(App.currentIndex <= 0)
        return;

    await goToStudent(
        App.students[
            App.currentIndex - 1
        ]
    );

}