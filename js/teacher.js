import { db } from "./firebase.js";
import { ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { generateGeminiSummary } from "./gemini.js";

let CLASS_ID = null;
let transcriptData = [];
let recognition;
let isMicOn = false;

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-lecture");
    const titleInput = document.getElementById("lecture-title");
    const codeBox = document.getElementById("lecture-code");
    const startScreen = document.getElementById("teacher-start");
    const dashboard = document.getElementById("teacher-dashboard");
    const micBtn = document.getElementById("mic-toggle");
    const transcriptBox = document.getElementById("live-transcript");
    const summaryBtn = document.getElementById("generate-summary");
    const summaryOutput = document.getElementById("summary-output");
    const countBadge = document.querySelector(".session-badge");

    startBtn.addEventListener("click", async () => {
        const title = titleInput.value.trim();
        if (!title) return;

        CLASS_ID = Math.floor(100000 + Math.random() * 900000).toString();

        await set(ref(db, "classes/" + CLASS_ID), {
            title,
            status: "live",
            createdAt: Date.now(),
            transcript: [],
            summary: ""
        });

        onValue(ref(db, "classes/" + CLASS_ID + "/students"), (snap) => {
            const count = snap.val() || 0;
            countBadge.innerText = `🔴 Live Session: ${CLASS_ID} · ${count} students`;
        });

        codeBox.innerHTML = `Lecture Code: <b>${CLASS_ID}</b>`;
        
        setTimeout(() => {
            startScreen.style.display = "none";
            dashboard.style.display = "block";
        }, 1200);
    });

    micBtn.addEventListener("click", async () => {
        if (!CLASS_ID) return;
        if (!recognition) recognition = initSpeech();

        if (!isMicOn) {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            recognition.start();
            isMicOn = true;
            micBtn.textContent = "🛑 Stop Mic";
        } else {
            recognition.stop();
            isMicOn = false;
            micBtn.textContent = "🎤 Start Mic";
        }
    });

    summaryBtn.addEventListener("click", async () => {
        if (transcriptData.length === 0) return;
        summaryOutput.innerHTML = "⏳ Generating...";

        const summary = await generateGeminiSummary(transcriptData.join(" "));
        await update(ref(db, "classes/" + CLASS_ID), { summary });
        summaryOutput.innerHTML = summary;
    });

    function initSpeech() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const r = new SR();
        r.lang = "en-IN";
        r.continuous = true;

        r.onresult = async (e) => {
            const text = e.results[e.results.length - 1][0].transcript;
            transcriptData.push(text);

            const p = document.createElement("p");
            p.textContent = "🎙 " + text;
            transcriptBox.appendChild(p);

            await update(ref(db, "classes/" + CLASS_ID), {
                lastText: text,
                transcript: transcriptData
            });
        };

        r.onend = () => { if (isMicOn) r.start(); };
        return r;
    }

});
