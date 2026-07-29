export const App = {

    students: [],

    currentStudent: null,

    currentIndex: -1,

    isDirty: false,

    isSaving: false,

    loading: false

};



// =============================
// STUDENTS
// =============================

export function setStudents(students){

    App.students = students;

}



// =============================
// SELECT STUDENT
// =============================

export function selectStudent(srNo){

    const index = App.students.findIndex(

        student => student.srNo === srNo

    );

    if(index === -1){

        return null;

    }

    App.currentIndex = index;

    App.currentStudent = App.students[index];

    App.isDirty = false;

    return App.currentStudent;

}



// =============================
// UPDATE FIELD
// =============================

export function updateCurrentStudentField(field,value){

    if(!App.currentStudent){

        return;

    }

    App.currentStudent[field] = value;

    App.isDirty = true;

}



// =============================
// DIRTY STATE
// =============================

export function clearDirty(){

    App.isDirty = false;

}



export function markSaving(){

    App.isSaving = true;

}



export function clearSaving(){

    App.isSaving = false;

}