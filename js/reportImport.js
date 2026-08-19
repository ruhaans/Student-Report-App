function normaliseKey(key) {
    return String(key).toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function valueFor(object, aliases) {
    if (!object || typeof object !== "object" || Array.isArray(object)) return undefined;
    const entries = new Map(
        Object.entries(object).map(([key, value]) => [normaliseKey(key), value])
    );
    for (const alias of aliases) {
        const value = entries.get(normaliseKey(alias));
        if (typeof value === "string") return value.trim();
    }
    return undefined;
}

function sectionFor(object, aliases) {
    if (!object || typeof object !== "object" || Array.isArray(object)) return undefined;
    const entry = Object.entries(object).find(([key]) =>
        aliases.some(alias => normaliseKey(key) === normaliseKey(alias))
    );
    return entry && typeof entry[1] === "object" ? entry[1] : undefined;
}

export function parseJsonInput(input) {
    let text = input.trim().replace(/^\uFEFF/, "");
    const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (fenced) text = fenced[1].trim();

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (initialError) {
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace < 0 || lastBrace <= firstBrace) {
            throw new Error("The pasted report is not valid JSON.");
        }
        try {
            parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));
        } catch {
            throw new Error("The pasted report is not valid JSON.");
        }
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("The pasted report must be a JSON object.");
    }

    for (const wrapper of ["report", "result", "data"]) {
        const nested = sectionFor(parsed, [wrapper]);
        if (nested) {
            parsed = nested;
            break;
        }
    }

    const english = sectionFor(parsed, ["english"]);
    const maths = sectionFor(parsed, ["math", "maths", "mathematics"]);
    const evs = sectionFor(parsed, ["evs", "environmental studies"]);

    const report = {
        introduction: valueFor(parsed, ["introduction", "general introduction", "general comment"]),
        englishAppreciation: valueFor(parsed, ["english appreciation"])
            ?? valueFor(english, ["appreciation", "strengths"]),
        englishSuggestion: valueFor(parsed, ["english suggestion"])
            ?? valueFor(english, ["suggestion", "next steps"]),
        mathAppreciation: valueFor(parsed, ["math appreciation", "maths appreciation", "mathematics appreciation"])
            ?? valueFor(maths, ["appreciation", "strengths"]),
        mathSuggestion: valueFor(parsed, ["math suggestion", "maths suggestion", "mathematics suggestion"])
            ?? valueFor(maths, ["suggestion", "next steps"]),
        evsAppreciation: valueFor(parsed, ["evs appreciation", "environmental studies appreciation"])
            ?? valueFor(evs, ["appreciation", "strengths"]),
        evsSuggestion: valueFor(parsed, ["evs suggestion", "environmental studies suggestion"])
            ?? valueFor(evs, ["suggestion", "next steps"])
    };

    const imported = Object.fromEntries(
        Object.entries(report).filter(([, value]) => typeof value === "string")
    );
    if (!Object.keys(imported).length) {
        throw new Error("No report fields were found. Paste the JSON returned by Gemini and try again.");
    }
    return imported;
}
