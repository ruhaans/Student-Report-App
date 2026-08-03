const THEME_KEY = "student-report-theme";
const LAST_STUDENT_KEY = "student-report-last-student";
const SCROLL_KEY = "student-report-scroll-position";

function read(key) { try { return localStorage.getItem(key); } catch { return null; } }
function write(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* Storage unavailable. */ } }

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    const dark = theme === "dark";
    toggle.textContent = dark ? "☀ Light mode" : "◐ Dark mode";
    toggle.setAttribute("aria-pressed", String(dark));
}

export function initializePreferences() {
    setTheme(read(THEME_KEY) || "light");
    document.getElementById("themeToggle")?.addEventListener("click", () => {
        const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        setTheme(theme);
        write(THEME_KEY, theme);
    });
    const content = document.querySelector(".content");
    let saveTimer;
    content?.addEventListener("scroll", () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => write(SCROLL_KEY, content.scrollTop), 150);
    }, { passive: true });
}

export function rememberStudent(srNo) { write(LAST_STUDENT_KEY, srNo); }

export function getRememberedStudent(students) {
    const saved = read(LAST_STUDENT_KEY);
    return students.find(student => String(student.srNo) === saved) || null;
}

export function restoreScrollPosition() {
    const content = document.querySelector(".content");
    const position = Number(read(SCROLL_KEY));
    if (content && Number.isFinite(position)) content.scrollTop = position;
}
