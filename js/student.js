document.addEventListener("DOMContentLoaded", () => {
  const joinBtn = document.getElementById("join-btn");
  const codeInput = document.getElementById("class-code-input");
  const joinScreen = document.getElementById("join-screen");
  const dashboard = document.getElementById("student-dashboard");

  if (!joinBtn || !codeInput) return;

  joinBtn.addEventListener("click", () => {
    const code = codeInput.value.trim();

    if (!code) {
      alert("Enter a session code");
      return;
    }

    joinScreen.style.display = "none";
    dashboard.style.display = "block";

    window.startStudentSession(code);
  });
});