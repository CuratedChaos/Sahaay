function generateSessionCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (err) {
        return;
    }
}

function formatTimestamp() {
    return new Date().toLocaleTimeString();
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#a855f7';
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function joinAsStudent() {
    const code = document.getElementById('student-code').value;
    if (code) window.location.href = `student.html?code=${code}`;
}

function saveToFirebase(key, data) {
    database.ref(key).set(data).catch(() => {
        saveToLocalStorage(key, data);
    });
}

function getFromFirebase(key, callback) {
    database.ref(key).once('value').then((snapshot) => {
        callback(snapshot.val());
    }).catch(() => {
        callback(getFromLocalStorage(key));
    });
}

function listenToFirebase(key, callback) {
    database.ref(key).on('value', (snapshot) => {
        callback(snapshot.val());
    });
}

if (document.getElementById('particle-canvas')) initParticles();

window.saveToFirebase = saveToFirebase;
window.getFromFirebase = getFromFirebase;
window.listenToFirebase = listenToFirebase;