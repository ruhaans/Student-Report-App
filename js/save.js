import { App, clearDirty, markSaving, clearSaving } from "./app.js";
import { saveStudent } from "./api.js";
import { updateStatus } from "./ui.js";
import { refreshStudent } from "./ui.js";
import { updateProgress } from "./progress.js";

export async function saveCurrentStudent() {

    if (!App.currentStudent) return true;

    if (!App.isDirty) return true;

    if (App.isSaving) return false;

    markSaving();

    updateStatus("saving", "Saving...");

    try {

        const result = await saveStudent(App.currentStudent);

        clearSaving();

        if (result.success) {

            clearDirty();

            refreshStudent(
    App.currentStudent
);

updateProgress();

            updateStatus("saved", "✔ Saved");

            return true;

        }

        updateStatus("error", "Save Failed");

        return false;

    } catch (err) {

        clearSaving();

        updateStatus("error", "Save Failed");

        console.error(err);

        return false;

    }

}