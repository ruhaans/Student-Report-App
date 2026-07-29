export function renderStudentList(students, onClick) {

    const list = document.getElementById("studentList");

    list.innerHTML = "";

    students.forEach(student => {

        const div = document.createElement("div");

        div.className = "student";

        div.dataset.srNo = student.srNo;

        div.innerHTML = `
            <div class="student-row">

                <span class="student-dot ${getStudentStatus(student)}"></span>

                <span class="student-number">
                    ${String(student.srNo).padStart(2,"0")}
                </span>

                <span class="student-name">
                    ${student.name}
                </span>

            </div>
        `;

        div.addEventListener("click", () => onClick(student));

        list.appendChild(div);

    });

}



export function refreshStudent(student){

    const dot = document.querySelector(
        `[data-sr-no="${student.srNo}"] .student-dot`
    );

    if(!dot) return;

    dot.classList.remove(
        "empty",
        "progress",
        "completed"
    );

    dot.classList.add(
        getStudentStatus(student)
    );

}



export function updateStudentForm(student) {

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



export function updateStatus(type, text) {

    const bar = document.getElementById("statusBar");

    bar.className = `status ${type}`;

    bar.textContent = text;

}



export function updateStudentPosition(index, total) {

    document.getElementById(
        "studentPosition"
    ).textContent = `${index + 1} / ${total}`;

    const firstStudent = index === 0;
    const lastStudent = index === total - 1;

    // Top buttons (if they exist)
    const previousTop = document.getElementById("previousButton");
    const nextTop = document.getElementById("nextButton");

    if(previousTop)
        previousTop.disabled = firstStudent;

    if(nextTop)
        nextTop.disabled = lastStudent;

    // Bottom buttons
    const previousBottom = document.getElementById("previousBottomButton");
    const nextBottom = document.getElementById("nextBottomButton");

    if(previousBottom)
        previousBottom.disabled = firstStudent;

    if(nextBottom)
        nextBottom.disabled = lastStudent;

}



export function getStudentStatus(student) {

    const fields = [

        student.introduction,
        student.englishAppreciation,
        student.englishSuggestion,
        student.mathAppreciation,
        student.mathSuggestion,
        student.evsAppreciation,
        student.evsSuggestion

    ];

    const filled = fields.filter(field =>
        String(field).trim() !== ""
    ).length;

    if (filled === 0)
        return "empty";

    if (filled === fields.length)
        return "completed";

    return "progress";

}



export function highlightStudent(srNo){

    document
        .querySelectorAll(".student")
        .forEach(student=>{

            student.classList.remove("active");

        });

    const current = document.querySelector(
        `[data-sr-no="${srNo}"]`
    );

    if(current){

        current.classList.add("active");

    }

}