import { App } from "./app.js";
import { MASTER_PROMPT } from "./masterPrompt.js";
import { generateReport } from "./api.js";
import { saveCurrentStudent } from "./save.js";
import { updateStatus } from "./ui.js";
import { updateAllWordCounts } from "./events.js";
import { setReportFieldValue } from "./grammarChecker.js";
const modal = document.getElementById("aiModal");

const openButton = document.getElementById("aiReportButton");

const closeButton = document.getElementById("closeModal");

const studentName = document.getElementById("aiStudentName");

const copyButton = document.getElementById("copyPromptButton");

const generateButton =
    document.getElementById("generateButton");



export function initializeAI(){

    openButton.addEventListener(
        "click",
        openModal
    );

    closeButton.addEventListener(
        "click",
        closeModal
    );

    generateButton.addEventListener(
    "click",
    generateAIReport
);

    copyButton.addEventListener(
        "click",
        copyPrompt
    );

    modal.addEventListener(
        "click",
        event=>{

            if(event.target === modal){

                closeModal();

            }

        }
    );

    document.addEventListener(
        "keydown",
        event=>{

            if(
                event.key === "Escape" &&
                modal.classList.contains("show")
            ){

                closeModal();

            }

        }
    );

}

function openModal() {

    if (App.currentStudent) {

        // Student Details
        document.getElementById("aiStudentName").textContent =
            App.currentStudent.name;

        document.getElementById("aiHouse").textContent =
            App.currentStudent.house
                ? `${App.currentStudent.house} House`
                : "";

        document.getElementById("aiEvent").textContent =
            App.currentStudent.event || "";

        // --------------------------
        // Load Teacher Observations
        // --------------------------

        document.getElementById("generalAttitude").value =
            App.currentStudent.generalAttitude || "";

        document.getElementById("assemblies").value =
            App.currentStudent.assembly || "";

        document.getElementById("events").value =
            App.currentStudent.eventObservation || "";

        document.getElementById("englishNotes").value =
            App.currentStudent.english || "";

        document.getElementById("mathNotes").value =
            App.currentStudent.maths || "";

        document.getElementById("evsNotes").value =
            App.currentStudent.evs || "";

        // --------------------------
        // Circle Time
        // --------------------------

        let circleTime = "";

        if (App.currentStudent.circleTime1) {

            circleTime +=
`Observation 1:
${App.currentStudent.circleTime1}`;

        }

        if (App.currentStudent.circleTime2) {

            if (circleTime !== "")
                circleTime += "\n\n";

            circleTime +=
`Observation 2:
${App.currentStudent.circleTime2}`;

        }

        document.getElementById("circleTime").value =
            circleTime;

    }

    // Always clear JSON import box
    document.getElementById("jsonInput").value = "";

    modal.classList.add("show");

}

function closeModal(){

    modal.classList.remove("show");

}

async function copyPrompt() {

    const finalPrompt = `${MASTER_PROMPT}

==================================================
TASK
==================================================
Generate a complete student report by strictly following all the instructions above.

Teacher observations always take priority over standard paragraphs.

Use standard paragraphs only where explicitly permitted.

Return ONLY valid JSON.

==================================================
TEACHER OBSERVATIONS
==================================================

Student Name:
${document.getElementById("aiStudentName").textContent}

GENERAL ATTITUDE
------------------------------
${document.getElementById("generalAttitude").value}

CIRCLE TIME
------------------------------
${document.getElementById("circleTime").value}

ASSEMBLIES
------------------------------
${document.getElementById("assemblies").value}

HOUSE
${App.currentStudent.house}

INTER-HOUSE EVENT
${App.currentStudent.event}

EVENTS / INTER-HOUSE COMPETITIONS
------------------------------
${document.getElementById("events").value}


ENGLISH
------------------------------
${document.getElementById("englishNotes").value}

MATHEMATICS
------------------------------
${document.getElementById("mathNotes").value}

EVS
------------------------------
${document.getElementById("evsNotes").value}`;

    try {

        await navigator.clipboard.writeText(finalPrompt);

        copyButton.textContent = "✅ Gemini Prompt Copied";

        setTimeout(() => {

            copyButton.textContent = "📋 Copy Gemini Prompt";

        }, 2000);

    } catch (error) {

        console.error(error);

        alert("Failed to copy prompt.");

    }


}

const loadingOverlay =
    document.getElementById("aiLoadingOverlay");

const loadingTitle =
    document.getElementById("aiLoadingTitle");

const loadingMessage =
    document.getElementById("aiLoadingMessage");

let loadingInterval = null;

const TEACHER_NAME = "Payal";

function getGreeting(){

    const hour = new Date().getHours();

    if(hour < 12)
        return "Good morning";

    if(hour < 17)
        return "Good afternoon";

    return "Good evening";

}

function showLoading(){

    document.getElementById("aiGreeting").textContent =
        `${getGreeting()}, ${TEACHER_NAME}! 👋`;

    document.getElementById("aiPreparingStudent").textContent =
        `Preparing ${App.currentStudent.name}'s report card...`;

    loadingOverlay.classList.add("show");

}

function hideLoading(){

    loadingOverlay.classList.remove("show");

}

function startLoadingAnimation(){

    const messages=[

        "🧠 Analysing teacher observations...",

        "📝 Drafting Introduction...",

        "📖 Writing English comments...",

        "➗ Preparing Mathematics comments...",

        "🌱 Writing EVS comments...",

        "✨ Finalising report..."

    ];

    let i=0;

    loadingMessage.textContent=messages[0];

    loadingInterval=setInterval(()=>{

        i=(i+1)%messages.length;

        loadingMessage.textContent=messages[i];

    },1800);

}

function stopLoadingAnimation(){

    clearInterval(loadingInterval);

}

async function generateAIReport() {

    const startTime=Date.now();

showLoading();

startLoadingAnimation();
    generateButton.disabled = true;

    generateButton.textContent =
        "⏳ Generating...";

    try {

        const finalPrompt = `${MASTER_PROMPT}

==================================================
TASK
==================================================
Generate a complete student report by strictly following all the instructions above.

Teacher observations always take priority over standard paragraphs.

Return ONLY valid JSON.

==================================================
TEACHER OBSERVATIONS
==================================================

Student Name:
${App.currentStudent.name}

HOUSE
------------------------------
${App.currentStudent.house}

INTER-HOUSE EVENT
------------------------------
${App.currentStudent.event}

GENERAL ATTITUDE
------------------------------
${document.getElementById("generalAttitude").value}

CIRCLE TIME
------------------------------
${document.getElementById("circleTime").value}

ASSEMBLIES
------------------------------
${document.getElementById("assemblies").value}

EVENTS
------------------------------
${document.getElementById("events").value}

ENGLISH
------------------------------
${document.getElementById("englishNotes").value}

MATHEMATICS
------------------------------
${document.getElementById("mathNotes").value}

EVS
------------------------------
${document.getElementById("evsNotes").value}`;

        const result = await generateReport(finalPrompt);

        if (!result.success) {

    throw new Error(result.message);

}
const report = result;

        console.log(JSON.stringify(result, null, 2));

        // -----------------------------
        // Populate Report Fields
        // -----------------------------

        setReportFieldValue("introduction", result.introduction || "");

        setReportFieldValue("englishAppreciation", result.englishAppreciation || "");

        setReportFieldValue("englishSuggestion", result.englishSuggestion || "");

        setReportFieldValue("mathAppreciation", result.mathAppreciation || "");

        setReportFieldValue("mathSuggestion", result.mathSuggestion || "");

        setReportFieldValue("evsAppreciation", result.evsAppreciation || "");

        setReportFieldValue("evsSuggestion", result.evsSuggestion || "");

        // -----------------------------
        // Update Current Student
        // -----------------------------

        App.currentStudent.introduction =
            result.introduction || "";

        App.currentStudent.englishAppreciation =
            result.englishAppreciation || "";

        App.currentStudent.englishSuggestion =
            result.englishSuggestion || "";

        App.currentStudent.mathAppreciation =
            result.mathAppreciation || "";

        App.currentStudent.mathSuggestion =
            result.mathSuggestion || "";

        App.currentStudent.evsAppreciation =
            result.evsAppreciation || "";

        App.currentStudent.evsSuggestion =
            result.evsSuggestion || "";

        // -----------------------------
        // Refresh UI
        // -----------------------------

        App.isDirty = true;

        updateAllWordCounts();

        updateStatus(
            "unsaved",
            "AI Report Generated"
        );

        // -----------------------------
        // Auto Save
        // -----------------------------

        await saveCurrentStudent();

        updateStatus(
            "saved",
            "✔ AI Report Generated & Saved"
        );

        const elapsed=Date.now()-startTime;

const minimum=2000;

if(elapsed<minimum){

    await new Promise(resolve=>

        setTimeout(resolve,minimum-elapsed)

    );

}
loadingTitle.textContent="✅ Report Generated";

stopLoadingAnimation();



loadingMessage.textContent="Saving completed successfully.";

await new Promise(resolve=>

    setTimeout(resolve,900)

);

hideLoading();

closeModal();



    }

    catch(error){

        console.error(error);

        alert(
            error.message || "Generation failed."
        );

    }

    finally{

        generateButton.disabled = false;

        generateButton.textContent =
            "✨ Generate Report";

    }

}
