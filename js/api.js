import { API_URL } from "./config.js";

export async function loadAllStudents() {

    const response = await fetch(
        `${API_URL}?action=load`
    );

    return await response.json();

}

export async function saveStudent(student) {

    const response = await fetch(
        `${API_URL}?action=save`,
        {
            method: "POST",
            body: JSON.stringify(student)
        }
    );

    return await response.json();

}