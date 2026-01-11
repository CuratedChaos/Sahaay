import { db } from "./firebase.js";
import { ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

window.startStudentSession = function (code) {
  const classRef = ref(db, "classes/" + code);
  const countRef = ref(db, "classes/" + code + "/students");

  runTransaction(countRef, (current) => {
    return (current || 0) + 1;
  });

  onValue(classRef, (snapshot) => {
    if (!snapshot.exists()) {
      document.getElementById("large-transcript").innerText = "❌ No live lecture found";
      return;
    }

    const data = snapshot.val();
    if (data.lastText) {
      document.getElementById("large-transcript").innerText = data.lastText;
    }
    if (data.summary) {
      document.getElementById("student-summary").innerText = data.summary;
    }
  });
};