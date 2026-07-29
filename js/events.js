import {

    updateCurrentStudentField

}

from "./app.js";



import {

    saveCurrentStudent

}

from "./save.js";



import {

    updateStatus

}

from "./ui.js";



const fields=[

"introduction",

"englishAppreciation",

"englishSuggestion",

"mathAppreciation",

"mathSuggestion",

"evsAppreciation",

"evsSuggestion"

];



export function initializeEvents(){

    fields.forEach(field=>{

        const textarea=

            document.getElementById(field);

        textarea.addEventListener(

            "input",

            event=>{

                updateCurrentStudentField(

                    field,

                    event.target.value

                );

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
    document.addEventListener("keydown", async (e) => {

    if ((e.ctrlKey || e.metaKey) && e.key === "s") {

        e.preventDefault();

        await saveCurrentStudent();

    }

});

}



export function initializeSaveButton(){

    document

    .getElementById(

        "saveButton"

    )

    .addEventListener(

        "click",

        saveCurrentStudent

    );

}