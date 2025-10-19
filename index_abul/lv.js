const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const w = (canvas.width = window.innerWidth);
const h = (canvas.height = window.innerHeight);

let particles = [];
let numParticles = 900; 
let animationFrame;
const overlay = document.getElementById("overlay");
const headline = document.getElementById("headline");

document.getElementById("particles").addEventListener("input", (e) => {
  numParticles = parseInt(e.target.value);
  resetParticles();
});
document.getElementById("btn-start").addEventListener("click", startAnimation);
document.getElementById("btn-reset").addEventListener("click", resetParticles);

function createParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1.2,
      color: "rgba(0,200,255,0.8)",
      tx: 0,
      ty: 0,
      speed: 0.10 + Math.random() * 0.10, // 💨 dua kali lebih cepat dari sebelumnya
    });
  }
}

function drawHeartShape(scale = 12) {
  const points = [];
  for (let t = 0; t < Math.PI * 2; t += 0.1) {
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y =
      -scale *
      (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x: x + w / 2, y: y + h / 2 });
  }
  return points;
}

function getTextPoints(text) {
  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");
  tempCanvas.width = w;
  tempCanvas.height = h;
  tctx.font = "bold 130px Poppins";
  tctx.fillStyle = "#00bfff";
  tctx.textAlign = "center";
  tctx.fillText(text, w / 2, h / 2);

  const imageData = tctx.getImageData(0, 0, w, h).data;
  const points = [];

  for (let y = 0; y < h; y += 8) {
    for (let x = 0; x < w; x += 8) {
      const alpha = imageData[(y * w + x) * 4 + 3];
      if (alpha > 128) points.push({ x, y });
    }
  }
  return points;
}

// ✨ Ganti tulisan partikel utama jadi "Love Uu"
let heartPoints = drawHeartShape(12);
let textPoints = getTextPoints("Love You");

function updateParticles(targetPoints) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const target = targetPoints[i % targetPoints.length];
    p.x += (target.x - p.x) * p.speed;
    p.y += (target.y - p.y) * p.speed;
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
}

function startAnimation() {
  cancelAnimationFrame(animationFrame);
  headline.classList.remove("show-text");

  let phase = 0; 
  let timer = 0;

  function animate() {
    timer++;

    // 💞 Semua fase dipercepat 2x
    if (phase === 0 && timer > 30) {
      updateParticles(heartPoints);
      if (timer > 150) { // dari 300 → 150
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1 && timer > 100) { // dari 200 → 100
      updateParticles(textPoints);
      if (timer > 200) { // dari 400 → 200
        phase = 2;
        headline.classList.add("show-text");
      }
    }

    drawParticles();
    animationFrame = requestAnimationFrame(animate);
  }

  animate();
}

function resetParticles() {
  cancelAnimationFrame(animationFrame);
  createParticles();
  ctx.clearRect(0, 0, w, h);
  drawParticles();
  headline.classList.remove("show-text");
}

createParticles();
drawParticles();
