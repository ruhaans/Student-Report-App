let messageTimer;

function showTypoMessage() {
    const bubble = document.querySelector(".writing-companion-message");
    const mascot = document.querySelector(".writing-companion-character");
    if (!bubble || !mascot) return;
    bubble.textContent = "Hey Payal, I think there may be a typo here. What do you think?";
    bubble.classList.remove("is-visible");
    mascot.classList.remove("is-alert");
    requestAnimationFrame(() => bubble.classList.add("is-visible"));
    requestAnimationFrame(() => mascot.classList.add("is-alert"));
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
        bubble.classList.remove("is-visible");
        mascot.classList.remove("is-alert");
    }, 7000);
}

export function initializeWritingCompanion() {
    const companion = document.getElementById("writingCompanion");
    const dismiss = document.getElementById("dismissCompanion");
    if (!companion || sessionStorage.getItem("student-report-companion-hidden")) {
        companion?.remove();
        return;
    }
    dismiss?.addEventListener("click", () => {
        sessionStorage.setItem("student-report-companion-hidden", "true");
        companion.remove();
    });
    let lastTypos = 0;
    document.addEventListener("writingcheck", event => {
        const typos = event.detail.spellingCount;
        if (typos > 0 && typos !== lastTypos) showTypoMessage();
        lastTypos = typos;
    });
}
