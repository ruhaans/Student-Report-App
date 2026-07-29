export function renderStudentList(students, onClick){

    const list =
        document.getElementById("studentList");

    list.innerHTML = "";

    students.forEach(student=>{

        const div =
            document.createElement("div");

        div.className = "student";

        div.innerHTML = `

            <strong>${student.srNo}</strong>

            <br>

            ${student.name}

        `;

        div.addEventListener(

    "click",

    ()=>onClick(student)

);

        list.appendChild(div);

    });

}



export function updateStudentForm(student){

    document.getElementById("studentName").textContent =
        student.name;

    document.getElementById("studentNumber").textContent =
        `SR No : ${student.srNo}`;

    document.getElementById("introduction").value =
        student.introduction;

    document.getElementById("englishAppreciation").value =
        student.englishAppreciation;

    document.getElementById("englishSuggestion").value =
        student.englishSuggestion;

    document.getElementById("mathAppreciation").value =
        student.mathAppreciation;

    document.getElementById("mathSuggestion").value =
        student.mathSuggestion;

    document.getElementById("evsAppreciation").value =
        student.evsAppreciation;

    document.getElementById("evsSuggestion").value =
        student.evsSuggestion;

}
export function updateStatus(type,text){

    const bar =

        document.getElementById("statusBar");

    bar.className =

        `status ${type}`;

    bar.textContent = text;

}