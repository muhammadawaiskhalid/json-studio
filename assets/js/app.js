
"use strict";

/* =========================================================
   JSON STUDIO
   Application Logic — v1.0
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        input: document.getElementById("jsonInput"),
        output: document.getElementById("jsonOutput"),

        inputLines: document.getElementById("inputLines"),
        outputLines: document.getElementById("outputLines"),

        inputStats: document.getElementById("inputStats"),
        outputStats: document.getElementById("outputStats"),

        formatBtn: document.getElementById("formatBtn"),
        minifyBtn: document.getElementById("minifyBtn"),
        validateBtn: document.getElementById("validateBtn"),

        sampleBtn: document.getElementById("sampleBtn"),
        clearBtn: document.getElementById("clearBtn"),
        pasteBtn: document.getElementById("pasteBtn"),
        copyBtn: document.getElementById("copyBtn"),
        downloadBtn: document.getElementById("downloadBtn"),

        feedbackBar: document.getElementById("feedbackBar"),
        feedbackIcon: document.getElementById("feedbackIcon"),
        feedbackMessage: document.getElementById("feedbackMessage")
    };

    const sampleData = {
        project: "JSON Studio",
        version: "1.0.0",
        author: "Muhammad Awais Khalid",
        features: [
            "Format JSON",
            "Validate syntax",
            "Minify JSON",
            "Copy and download"
        ],
        settings: {
            theme: "dark",
            indentation: 2,
            localProcessing: true
        },
        active: true,
        releaseDate: "2026-11-06"
    };

    let lastAction = null;

    /* =====================================================
       FEEDBACK
    ====================================================== */

    function showFeedback(message, type = "neutral") {
        elements.feedbackBar.classList.remove(
            "is-success",
            "is-error"
        );

        if (type === "success") {
            elements.feedbackBar.classList.add("is-success");
            elements.feedbackIcon.textContent = "✓";
        } else if (type === "error") {
            elements.feedbackBar.classList.add("is-error");
            elements.feedbackIcon.textContent = "!";
        } else {
            elements.feedbackIcon.textContent = "•";
        }

        elements.feedbackMessage.textContent = message;
    }

    /* =====================================================
       EDITOR STATISTICS
    ====================================================== */

    function countLines(value) {
        if (value.length === 0) return 0;
        return value.split("\n").length;
    }

    function updateStats(editor, statsElement) {
        const value = editor.value;

        const characters = value.length;
        const lines = countLines(value);

        statsElement.textContent =
            `${characters.toLocaleString()} CHARACTERS · ` +
            `${lines.toLocaleString()} LINES`;
    }

    function updateLineNumbers(editor, lineElement) {
        const lineCount = Math.max(1, countLines(editor.value));

        const numbers = Array.from(
            { length: lineCount },
            (_, index) => index + 1
        );

        lineElement.textContent = numbers.join("\n");
    }

    function syncLineScroll(editor, lineElement) {
        lineElement.scrollTop = editor.scrollTop;
    }

    function updateEditor(editor, statsElement, lineElement) {
        updateStats(editor, statsElement);
        updateLineNumbers(editor, lineElement);
        syncLineScroll(editor, lineElement);
    }

    function refreshEditors() {
        updateEditor(
            elements.input,
            elements.inputStats,
            elements.inputLines
        );

        updateEditor(
            elements.output,
            elements.outputStats,
            elements.outputLines
        );
    }

    /* =====================================================
       JSON PARSING
    ====================================================== */

    function parseInput() {
        const source = elements.input.value.trim();

        if (!source) {
            throw new Error("Enter or paste JSON before continuing.");
        }

        try {
            return JSON.parse(source);
        } catch (error) {
            throw new Error(
                error instanceof SyntaxError
                    ? `Invalid JSON: ${error.message}`
                    : "Unable to parse JSON."
            );
        }
    }

    function setOutput(value) {
        elements.output.value = value;

        updateEditor(
            elements.output,
            elements.outputStats,
            elements.outputLines
        );

        elements.output.scrollTop = 0;
        elements.output.scrollLeft = 0;
        elements.outputLines.scrollTop = 0;
    }

    function handleError(error) {
        setOutput("");
        lastAction = null;

        showFeedback(
            error instanceof Error
                ? error.message
                : "Something went wrong.",
            "error"
        );
    }

    /* =====================================================
       FORMAT JSON
    ====================================================== */

    function formatJSON() {
        try {
            const data = parseInput();

            const formatted = JSON.stringify(data, null, 2);

            setOutput(formatted);

            lastAction = "format";

            showFeedback(
                "JSON formatted successfully with 2-space indentation.",
                "success"
            );
        } catch (error) {
            handleError(error);
        }
    }

    /* =====================================================
       MINIFY JSON
    ====================================================== */

    function minifyJSON() {
        try {
            const data = parseInput();

            const minified = JSON.stringify(data);

            setOutput(minified);

            lastAction = "minify";

            showFeedback(
                "JSON minified successfully.",
                "success"
            );
        } catch (error) {
            handleError(error);
        }
    }

    /* =====================================================
       VALIDATE JSON
    ====================================================== */

    function validateJSON() {
        try {
            parseInput();

            lastAction = "validate";

            showFeedback(
                "Valid JSON. No syntax errors detected.",
                "success"
            );
        } catch (error) {
            lastAction = null;

            showFeedback(
                error instanceof Error
                    ? error.message
                    : "Validation failed.",
                "error"
            );
        }
    }

    /* =====================================================
       LOAD SAMPLE
    ====================================================== */

    function loadSample() {
        elements.input.value = JSON.stringify(
            sampleData,
            null,
            2
        );

        setOutput("");
        lastAction = null;

        refreshEditors();

        showFeedback(
            "Sample JSON loaded. Select an action to continue.",
            "neutral"
        );

        elements.input.focus();
    }

    /* =====================================================
       CLEAR ALL
    ====================================================== */

    function clearAll() {
        elements.input.value = "";

        setOutput("");
        lastAction = null;

        refreshEditors();

        showFeedback(
            "Workspace cleared. Ready for new JSON.",
            "neutral"
        );

        elements.input.focus();
    }

    /* =====================================================
       CLIPBOARD
    ====================================================== */

    async function pasteFromClipboard() {
        if (
            !navigator.clipboard ||
            !navigator.clipboard.readText
        ) {
            showFeedback(
                "Clipboard access is unavailable. Paste manually using Ctrl + V.",
                "error"
            );
            return;
        }

        try {
            const text = await navigator.clipboard.readText();

            if (!text) {
                showFeedback(
                    "Your clipboard is empty.",
                    "neutral"
                );
                return;
            }

            elements.input.value = text;

            setOutput("");
            lastAction = null;

            refreshEditors();

            showFeedback(
                "Clipboard content pasted into the editor.",
                "success"
            );
        } catch {
            showFeedback(
                "Clipboard permission denied. Use Ctrl + V instead.",
                "error"
            );
        }
    }

    async function copyOutput() {
        const value = elements.output.value;

        if (!value) {
            showFeedback(
                "There is no output to copy.",
                "error"
            );
            return;
        }

        try {
            if (
                navigator.clipboard &&
                navigator.clipboard.writeText
            ) {
                await navigator.clipboard.writeText(value);
            } else {
                elements.output.focus();
                elements.output.select();

                const copied = document.execCommand("copy");

                if (!copied) {
                    throw new Error("Copy failed.");
                }
            }

            showFeedback(
                "Output copied to clipboard.",
                "success"
            );
        } catch {
            showFeedback(
                "Unable to copy automatically. Select the output and press Ctrl + C.",
                "error"
            );
        }
    }

    /* =====================================================
       DOWNLOAD JSON
    ====================================================== */

    function downloadJSON() {
        const value = elements.output.value;

        if (!value) {
            showFeedback(
                "Generate JSON output before downloading.",
                "error"
            );
            return;
        }

        const blob = new Blob(
            [value],
            { type: "application/json;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "json-studio-output.json";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        showFeedback(
            "JSON file download started.",
            "success"
        );
    }

    /* =====================================================
       INPUT HANDLING
    ====================================================== */

    function handleInputChange() {
        updateEditor(
            elements.input,
            elements.inputStats,
            elements.inputLines
        );

        if (lastAction !== null) {
            setOutput("");
            lastAction = null;

            showFeedback(
                "Input changed. Run an action to update the output.",
                "neutral"
            );
        }
    }

    /* =====================================================
       KEYBOARD SHORTCUTS
    ====================================================== */

    function handleKeyboardShortcuts(event) {
        const modifier = event.ctrlKey || event.metaKey;

        if (modifier && event.key === "Enter") {
            event.preventDefault();
            formatJSON();
        }

        if (
            event.target === elements.input &&
            event.key === "Tab"
        ) {
            event.preventDefault();

            const start = elements.input.selectionStart;
            const end = elements.input.selectionEnd;
            const value = elements.input.value;

            elements.input.value =
                value.slice(0, start) +
                "  " +
                value.slice(end);

            elements.input.selectionStart = start + 2;
            elements.input.selectionEnd = start + 2;

            handleInputChange();
        }
    }

    /* =====================================================
       EVENT LISTENERS
    ====================================================== */

    elements.formatBtn.addEventListener(
        "click",
        formatJSON
    );

    elements.minifyBtn.addEventListener(
        "click",
        minifyJSON
    );

    elements.validateBtn.addEventListener(
        "click",
        validateJSON
    );

    elements.sampleBtn.addEventListener(
        "click",
        loadSample
    );

    elements.clearBtn.addEventListener(
        "click",
        clearAll
    );

    elements.pasteBtn.addEventListener(
        "click",
        pasteFromClipboard
    );

    elements.copyBtn.addEventListener(
        "click",
        copyOutput
    );

    elements.downloadBtn.addEventListener(
        "click",
        downloadJSON
    );

    elements.input.addEventListener(
        "input",
        handleInputChange
    );

    elements.input.addEventListener(
        "scroll",
        () => syncLineScroll(
            elements.input,
            elements.inputLines
        )
    );

    elements.output.addEventListener(
        "scroll",
        () => syncLineScroll(
            elements.output,
            elements.outputLines
        )
    );

    document.addEventListener(
        "keydown",
        handleKeyboardShortcuts
    );

    /* =====================================================
       INITIALIZATION
    ====================================================== */

    refreshEditors();

    showFeedback(
        "Ready. Paste your JSON or load a sample to begin.",
        "neutral"
    );
});
