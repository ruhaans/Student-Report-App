import { App } from "./app.js";
import { renderStudentList } from "./ui.js";
import { goToStudent } from "./navigation.js";

export function initializeSearch(){

    const input =
        document.getElementById(
            "searchStudent"
        );

    input.addEventListener(
        "input",
        ()=>{

            const search =
                input.value
                    .trim()
                    .toLowerCase();

            const filtered =
                App.students.filter(student=>{

                    return (

                        student.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(student.srNo)
                            .includes(search)

                    );

                });

            renderStudentList(
    filtered,
    goToStudent
);

if(App.currentStudent){

    import("./ui.js").then(ui=>{

        ui.highlightStudent(
            App.currentStudent.srNo
        );

    });

}

        }

    );

}