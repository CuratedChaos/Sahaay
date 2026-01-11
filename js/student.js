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

document.getElementById('contrast-toggle').addEventListener('click', function() {
    const body = document.body;
    body.classList.toggle('high-contrast');
    
    // Update button text based on state
    if (body.classList.contains('high-contrast')) {
        this.textContent = '☀️ Normal Mode';
    } else {
        this.textContent = '🌓 High Contrast Mode';
    }
});

function sendReaction(type) {
    console.log("Reaction sent:", type);
    
    // Create a Braille/Screen Reader notification
    const brailleStream = document.getElementById('braille-stream');
    const announcement = type === 'understand' ? "Confirmed: You understand." : "Confirmed: You are confused.";
    
    brailleStream.textContent = announcement;
    
    // Clear it after a second so it can be re-announced later
    setTimeout(() => { brailleStream.textContent = ""; }, 1000);
}

function triggerHaptic() {
    if ("vibrate" in navigator) {
        navigator.vibrate(50); // Short 50ms vibration
    }
}

// Add this to your buttons:
// <button onclick="sendReaction('understand'); triggerHaptic();" ...>