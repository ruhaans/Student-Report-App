const REPORT_FIELDS = [
    "introduction", "englishAppreciation", "englishSuggestion",
    "mathAppreciation", "mathSuggestion", "evsAppreciation", "evsSuggestion"
];

import { App } from "./app.js";

const editors = new Map();
const endpoint = "https://api.languagetool.org/v2/check";
let suggestionMenu;

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

function getTextOffset(root, node, offset) {
    const range = document.createRange();
    range.setStart(root, 0);
    range.setEnd(node, offset);
    return range.toString().length;
}

function restoreCaret(editor, start, end) {
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let node; let count = 0; let startNode; let endNode;
    while ((node = walker.nextNode())) {
        const next = count + node.nodeValue.length;
        if (!startNode && start <= next) { startNode = node; }
        if (!endNode && end <= next) { endNode = node; break; }
        count = next;
    }
    if (!startNode || !endNode) return;
    const range = document.createRange();
    const startBefore = getTextOffset(editor, startNode, 0);
    const endBefore = getTextOffset(editor, endNode, 0);
    range.setStart(startNode, Math.max(0, Math.min(start - startBefore, startNode.nodeValue.length)));
    range.setEnd(endNode, Math.max(0, Math.min(end - endBefore, endNode.nodeValue.length)));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function render(editor, matches) {
    const selection = window.getSelection();
    const hasSelection = selection.rangeCount && editor.contains(selection.anchorNode);
    const start = hasSelection ? getTextOffset(editor, selection.anchorNode, selection.anchorOffset) : 0;
    const end = hasSelection ? getTextOffset(editor, selection.focusNode, selection.focusOffset) : start;
    const text = editor.textContent;
    const ordered = [...matches].sort((a, b) => a.offset - b.offset);
    let cursor = 0;
    let html = "";
    ordered.forEach(match => {
        if (match.offset < cursor || match.offset + match.length > text.length) return;
        html += escapeHtml(text.slice(cursor, match.offset));
        const kind = match.rule?.issueType === "misspelling" ? "spelling" : "grammar";
        html += `<span class="writing-issue ${kind}" data-offset="${match.offset}" data-length="${match.length}" data-replacements="${encodeURIComponent(JSON.stringify(match.replacements.slice(0, 5).map(item => item.value)))}" data-message="${encodeURIComponent(match.message)}">${escapeHtml(text.slice(match.offset, match.offset + match.length))}</span>`;
        cursor = match.offset + match.length;
    });
    editor.innerHTML = html + escapeHtml(text.slice(cursor));
    if (hasSelection) restoreCaret(editor, start, end);
}

function closeSuggestionMenu() {
    suggestionMenu?.remove();
    suggestionMenu = null;
}

function showSuggestions(event, editor) {
    const issue = event.target.closest(".writing-issue");
    if (!issue) return;
    event.preventDefault();
    closeSuggestionMenu();
    const replacements = JSON.parse(decodeURIComponent(issue.dataset.replacements));
    suggestionMenu = document.createElement("div");
    suggestionMenu.className = "writing-suggestions";
    suggestionMenu.innerHTML = `<p>${decodeURIComponent(issue.dataset.message)}</p>`;
    if (!replacements.length) suggestionMenu.innerHTML += "<span>No replacement is available.</span>";
    replacements.forEach(replacement => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = replacement;
        button.addEventListener("click", () => {
            const source = editor.textContent;
            const offset = Number(issue.dataset.offset);
            const length = Number(issue.dataset.length);
            setReportFieldValue(editor.id, source.slice(0, offset) + replacement + source.slice(offset + length));
            editor.dispatchEvent(new Event("input", { bubbles: true }));
            editor.focus();
            closeSuggestionMenu();
        });
        suggestionMenu.appendChild(button);
    });
    document.body.appendChild(suggestionMenu);
    const box = issue.getBoundingClientRect();
    suggestionMenu.style.left = `${Math.min(box.left, window.innerWidth - suggestionMenu.offsetWidth - 12)}px`;
    suggestionMenu.style.top = `${box.bottom + 8}px`;
}

async function check(editor, text) {
    if (text.trim().length < 3) return render(editor, []);
    try {
        const body = new URLSearchParams({ text, language: "en-GB", enabledOnly: "false" });
        const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
        if (!response.ok) throw new Error("Grammar service unavailable");
        const result = await response.json();
        if (editor.textContent === text) {
            const studentNames = new Set(
                App.students
                    .flatMap(student => String(student.name || "").split(/\s+/))
                    .map(name => name.toLocaleLowerCase())
            );
            const matches = (result.matches || []).filter(match => {
                const originalText = text.slice(match.offset, match.offset + match.length);
                const flaggedText = originalText
                    .replace(/[^\p{L}'-]/gu, "")
                    .toLocaleLowerCase();
                const isCapitalisedProperNoun = /^\p{Lu}[\p{L}'-]*$/u.test(originalText);
                return !(
                    match.rule?.issueType === "misspelling" &&
                    (studentNames.has(flaggedText) || isCapitalisedProperNoun)
                );
            });
            render(editor, matches);
            document.dispatchEvent(new CustomEvent("writingcheck", {
                detail: {
                    field: editor.id,
                    spellingCount: matches.filter(match => match.rule?.issueType === "misspelling").length
                }
            }));
        }
    } catch (error) {
        console.warn("Writing assistant could not check this text.", error);
    }
}

export function initializeGrammarChecker() {
    REPORT_FIELDS.forEach(id => {
        const textarea = document.getElementById(id);
        const editor = document.createElement("div");
        editor.id = id;
        editor.className = "report-editor";
        editor.contentEditable = "true";
        editor.setAttribute("role", "textbox");
        editor.setAttribute("aria-multiline", "true");
        editor.setAttribute("aria-label", textarea.closest(".report-card")?.querySelector(".card-title")?.textContent.trim() || id);
        textarea.classList.add("report-editor-source");
        textarea.id = `${id}Source`;
        textarea.setAttribute("aria-hidden", "true");
        textarea.tabIndex = -1;
        textarea.insertAdjacentElement("afterend", editor);
        editors.set(id, { textarea, editor, timer: null });
        editor.addEventListener("input", () => {
            textarea.value = editor.textContent;
            clearTimeout(editors.get(id).timer);
            editors.get(id).timer = setTimeout(() => check(editor, editor.textContent), 650);
        });
        editor.addEventListener("click", event => showSuggestions(event, editor));
    });
    document.addEventListener("click", event => {
        if (!event.target.closest(".writing-issue, .writing-suggestions")) closeSuggestionMenu();
    });
}

export function getReportEditor(id) { return editors.get(id)?.editor || document.getElementById(id); }

export function getReportFieldValue(id) { return editors.get(id)?.editor.textContent ?? document.getElementById(id).value; }

export function setReportFieldValue(id, value) {
    const entry = editors.get(id);
    if (!entry) { document.getElementById(id).value = value || ""; return; }
    clearTimeout(entry.timer);
    entry.textarea.value = value || "";
    entry.editor.textContent = value || "";
    check(entry.editor, entry.editor.textContent);
}
