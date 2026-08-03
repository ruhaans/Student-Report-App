import {
    App,
    updateCurrentStudentField
} from "./app.js";

import {
    saveCurrentStudent
} from "./save.js";

import {
    updateStatus
} from "./ui.js";
import { getReportEditor, getReportFieldValue } from "./grammarChecker.js";

import {
    nextStudent,
    previousStudent,
    goToStudent
} from "./navigation.js";

const fields = [

    "introduction",

    "englishAppreciation",

    "englishSuggestion",

    "mathAppreciation",

    "mathSuggestion",

    "evsAppreciation",

    "evsSuggestion"

];

const aiFields = [

    "generalAttitude",

    "circleTime",

    "assemblies",

    "events",

    "englishNotes",

    "mathNotes",

    "evsNotes"

];

export function initializeEvents(){

    fields.forEach(field=>{

        const textarea = getReportEditor(field);

        textarea.addEventListener(
            "input",
            event=>{

                updateCurrentStudentField(
                    field,
                    event.target.textContent
                );

                updateStatus(
                    "unsaved",
                    "Unsaved Changes"
                );

            }
        );

        textarea.addEventListener(
            "blur",
            async ()=>{

                if(document.activeElement === textarea)
                    return;

                await saveCurrentStudent();

            }
        );

    });

    aiFields.forEach(field => {

    const textarea = document.getElementById(field);

    if (!textarea) return;

    textarea.addEventListener(
        "input",
        () => {

            if (!App.currentStudent)
                return;

            switch (field) {

                case "generalAttitude":

                    App.currentStudent.generalAttitude =
                        textarea.value;
                    break;

                case "assemblies":

                    App.currentStudent.assembly =
                        textarea.value;
                    break;

                case "events":

                    App.currentStudent.eventObservation =
                        textarea.value;
                    break;

                case "englishNotes":

                    App.currentStudent.english =
                        textarea.value;
                    break;

                case "mathNotes":

                    App.currentStudent.maths =
                        textarea.value;
                    break;

                case "evsNotes":

                    App.currentStudent.evs =
                        textarea.value;
                    break;

                case "circleTime":

                    const text = textarea.value;

                    const obs1 =
                        text.match(/Observation 1:\s*([\s\S]*?)(?=\n\s*Observation 2:|$)/i);

                    const obs2 =
                        text.match(/Observation 2:\s*([\s\S]*)/i);

                    App.currentStudent.circleTime1 =
                        obs1 ? obs1[1].trim() : "";

                    App.currentStudent.circleTime2 =
                        obs2 ? obs2[1].trim() : "";

                    break;

            }

            App.isDirty = true;

            updateStatus(
                "unsaved",
                "Unsaved Changes"
            );

        }
    );

    textarea.addEventListener(
        "blur",
        async () => {

            if (document.activeElement === textarea)
                return;

            await saveCurrentStudent();

        }
    );

});

    // ==========================
    // Keyboard Shortcuts
    // ==========================

    document.addEventListener(
        "keydown",
        async (e)=>{

            if(!(e.ctrlKey || e.metaKey))
                return;

            switch(e.key){

                case "s":

                    e.preventDefault();

                    await saveCurrentStudent();

                    break;

                case "ArrowRight":

                    e.preventDefault();

                    await nextStudent();

                    break;

                case "ArrowLeft":

                    e.preventDefault();

                    await previousStudent();

                    break;

                case "f":

                    e.preventDefault();

                    document
                        .getElementById("searchStudent")
                        ?.focus();

                    break;

                case "Home":

                    e.preventDefault();

                    if(App.students.length){

                        await goToStudent(
                            App.students[0]
                        );

                    }

                    break;

                case "End":

                    e.preventDefault();

                    if(App.students.length){

                        await goToStudent(
                            App.students[
                                App.students.length-1
                            ]
                        );

                    }

                    break;

            }

        }
    );

    // ==========================
    // Prevent Refresh
    // ==========================

    window.addEventListener(
        "beforeunload",
        event=>{

            if(!App.isDirty)
                return;

            event.preventDefault();

            event.returnValue = "";

        }
    );

}

export function initializeSaveButton(){

    document
        .getElementById("saveButton")
        .addEventListener(
            "click",
            saveCurrentStudent
        );

}

export function initializeNavigation(){

    document
        .getElementById("nextButton")
        .addEventListener(
            "click",
            nextStudent
        );

    document
        .getElementById("previousButton")
        .addEventListener(
            "click",
            previousStudent
        );

    document
    .getElementById("previousBottomButton")
    ?.addEventListener("click", previousStudent);

document
    .getElementById("nextBottomButton")
    ?.addEventListener("click", nextStudent);

}

function updateWordCount(textareaId, counterId) {

    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);

    const words = getReportFieldValue(textareaId)
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;

    counter.textContent = `${words} words`;
}

export function updateAllWordCounts() {

    [
        ["introduction", "introductionCount"],
        ["englishAppreciation", "englishAppreciationCount"],
        ["englishSuggestion", "englishSuggestionCount"],
        ["mathAppreciation", "mathAppreciationCount"],
        ["mathSuggestion", "mathSuggestionCount"],
        ["evsAppreciation", "evsAppreciationCount"],
        ["evsSuggestion", "evsSuggestionCount"]
    ].forEach(([textareaId, counterId]) => {

        updateWordCount(textareaId, counterId);

    });

}
