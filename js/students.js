import { getStudents, getStudent } from "./api.js";

export async function loadStudents() {

    return await getStudents();

}

export async function loadStudent(srNo) {

    return await getStudent(srNo);

}