import { db } from "./firebase.js";
import { doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let sessionCode = null;
let sessionRef = null;

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

window.createSession = async function () {
  sessionCode = generateCode();
  sessionRef = doc(db, "sessions", sessionCode);

  await setDoc(sessionRef, {
    createdAt: Date.now(),
    transcript: [],
    reactions: { understand: 0, confused: 0, question: 0, speedup: 0, slowdown: 0 }
  });

  return sessionCode;
};

window.pushTranscript = async function (text) {
  if (!sessionRef) return;

  await updateDoc(sessionRef, {
    transcript: arrayUnion({
      text,
      time: new Date().toLocaleTimeString()
    })
  });
};