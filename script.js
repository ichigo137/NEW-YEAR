/* STARS */
const starsContainer = document.getElementById("stars-container");

for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    const size = Math.random() * 3;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.setProperty("--d", (Math.random() * 3 + 1) + "s");
    starsContainer.appendChild(star);
}

/* COUNTDOWN */
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("minutes");
const secsEl = document.getElementById("seconds");

const pre = document.getElementById("pre-celebration");
const celeb = document.getElementById("celebration");
const messages = [`🎉✨🥳 HAPPY NEW YEAR! 🥳✨🎉

🎆🌟 As the clock resets and a brand-new chapter begins, may this year bring you endless joy 😄, unstoppable success 🚀, good health 💪, and beautiful moments 💖 that make your heart smile every day!

🍀💫 May all your dreams turn into reality 🌈, your hard work shine bright 🌟, and every challenge turn into a victory 🏆! Keep believing in yourself 💡🔥—you’re capable of amazing things!

🎊🥂 Here’s to new beginnings 🌱, unforgettable memories 📸, late-night laughs 😂, big achievements 📈, and peaceful moments 🕊️. May your days be filled with love ❤️, positivity ✨, and happiness overflowing like fireworks in the sky 🎇🎆!

🎁🎉 Cheers to a year full of wins 🥇, smiles 😊, adventures 🌍, and magic 🪄!
💥🎇 WELCOME THE NEW YEAR WITH HOPE, ENERGY, AND LOTS OF LOVE! 🎇💥

🎆🎊💖 HAPPY NEW YEAR ONCE AGAIN! 💖🎊🎆`];
const nextYear = new Date().getFullYear() + 1;
const newYearTime = new Date(nextYear, 0, 1, 0, 0, 0).getTime();
/* AUDIO */
const audio = document.getElementById("newYearAudio");
const soundBtn = document.getElementById("soundToggle");
const themeSelect = document.getElementById("themeSelect");

themeSelect.onchange = (e) => {
    document.body.className = e.target.value;
};
soundBtn.onclick = () => {
    audio.muted = !audio.muted;
    soundBtn.textContent = audio.muted ? "🔇" : "🔊";
};
document.body.addEventListener("click", () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(()=>{});
    }
}, { once:true });
let audioCtx;

document.body.addEventListener("click", () => {
    if (!audioCtx) {
        audioCtx = new AudioContext();

        const source = audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        const freqData = new Uint8Array(analyser.frequencyBinCount);

        let lastBeat = 0;
const BEAT_COOLDOWN = 500; // ms
function beatCheck() {
    analyser.getByteFrequencyData(freqData);
    const now = Date.now();

    if (freqData[0] > 210 && now - lastBeat > BEAT_COOLDOWN) {
        softConfetti();   // 👈 reduced version
        lastBeat = now;
    }

    requestAnimationFrame(beatCheck);
}
        beatCheck();
    }
}, { once: true });

const flipSound = document.getElementById("flipSound");

function flip(el, value) {
    if (el.textContent !== value) {
        el.textContent = value;
        el.classList.add("flip");

        // play click ONLY for seconds
        if (el === secsEl) {
            flipSound.currentTime = 0;
            flipSound.play().catch(()=>{});
        }

        setTimeout(() => el.classList.remove("flip"), 400);
    }
}
function updateCountdown() {
    const now = Date.now();
    const gap = newYearTime - now;

    if (gap <= 0) {
        document.body.classList.add("warp");
        document.body.classList.remove("panic");
        document.body.classList.add("panic-exit");
        setTimeout(() => {
            document.body.classList.remove("panic-exit");
        }, 300);
        document.querySelector(".new-year-text").innerHTML = messages[Math.floor(Math.random() * messages.length)];
        pre.style.display = "none";
        celeb.style.display = "flex";
        audio.play().catch(()=>{});
        startFireworks();
        confetti();
        goldRain();
        clearInterval(timer);
        return;
    }
    
    if (gap <= 10000 && gap > 0) {
        document.body.classList.add("panic");
    }

    const d = Math.floor(gap / (1000*60*60*24));
    const h = Math.floor((gap / (1000*60*60)) % 24);
    const m = Math.floor((gap / (1000*60)) % 60);
    const s = Math.floor((gap / 1000) % 60);

    flip(daysEl, d.toString().padStart(2,"0"));
    flip(hoursEl, h.toString().padStart(2,"0"));
    flip(minsEl, m.toString().padStart(2,"0"));
    flip(secsEl, s.toString().padStart(2,"0"));
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

/* FIREWORKS */
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
};

let particles = [];

class Particle {
    constructor(x,y,color, isRain = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = 1;

    if (isRain) {
        this.vx = 0;                 // straight down
        this.vy = Math.random() * 2 + 3;
        this.size = Math.random() * 4 + 3;
        this.fadeSpeed = 0.005;
    } else {
        this.vx = (Math.random()-0.5)*8;
        this.vy = (Math.random()-0.5)*8;
        this.size = 5;
        this.fadeSpeed = 0.01;
    }
    }
    update() {
        this.x += this.vx;
        this.y += this.vy + 0.05;
        this.alpha -= this.fadeSpeed;
    }
    draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    const shape = Math.floor(Math.random() * 3);

    ctx.beginPath();

    if (shape === 0) {
        // circle
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    } 
    else if (shape === 1) {
        // ring
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        return;
    } 
    else {
        // star
        ctx.moveTo(this.x, this.y - 4);
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(
                this.x + Math.cos((18 + i * 72) * Math.PI / 180) * 4,
                this.y - Math.sin((18 + i * 72) * Math.PI / 180) * 4
            );
            ctx.lineTo(
                this.x + Math.cos((54 + i * 72) * Math.PI / 180) * 2,
                this.y - Math.sin((54 + i * 72) * Math.PI / 180) * 2
            );
        }
        ctx.closePath();
    }

    ctx.fill();
    }

}
function confetti() {
    for (let i = 0; i < 150; i++) {
        particles.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                `hsl(${Math.random() * 360},100%,60%)`
            )
        );
    }
}
function softConfetti() {
    for (let i = 0; i < 150; i++) {   // 👈 reduced
        particles.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
                `hsl(${Math.random() * 360},80%,65%)`
            )
        );
    }
}


function goldRain() {
    const end = Date.now() + 2500;

    const rainInterval = setInterval(() => {
        for (let i = 0; i < 12; i++) {
            particles.push(
                new Particle(
                    Math.random() * canvas.width,
                    -20,
                    "#FFD700",
                    true // 👈 GOLD RAIN MODE
                )
            );
        }
        if (Date.now() > end) clearInterval(rainInterval);
    }, 80);
}
let fireworkInterval;
function startFireworks() {
    if (fireworkInterval) return; // prevent duplicate intervals

    fireworkInterval = setInterval(() => {
        const x = Math.random()*canvas.width;
        const y = Math.random()*canvas.height/2;
        const color = `hsl(${Math.random()*360},100%,60%)`;

        for(let i=0;i<40;i++) {
            particles.push(new Particle(x,y,color));
        }
    }, 800);

    animate();
}
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}