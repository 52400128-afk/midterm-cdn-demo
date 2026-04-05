// ========== CẤU HÌNH 2 URL THẬT ===========
const BASE_NO_CDN = "https://52400128-afk.github.io/midterm-cdn-demo"; // GitHub Pages trực tiếp
const BASE_CDN = "https://cdn-demo.52400128.workers.dev"; // Cloudflare Workers domain

const images = [
  { name: "Ảnh 1", src: "large-photo-1.jpg", size: "4.4MB" },
  { name: "Ảnh 2", src: "large-photo-2.jpg", size: "3.8MB" },
  { name: "Ảnh 3", src: "large-photo-3.jpg", size: "5.0MB" },
];

const state = {
  cdnEnabled: false,
};

const cdnStatus = document.getElementById("cdnStatus");
const toggleButton = document.getElementById("toggleButton");
const runTestButton = document.getElementById("runTestButton");
const metricsGrid = document.getElementById("metricsGrid");

function updateStatus() {
  if (state.cdnEnabled) {
    cdnStatus.textContent = "Bật";
    cdnStatus.classList.remove("status-off");
    cdnStatus.classList.add("status-on");
    toggleButton.textContent = "Tắt CDN";
  } else {
    cdnStatus.textContent = "Tắt";
    cdnStatus.classList.remove("status-on");
    cdnStatus.classList.add("status-off");
    toggleButton.textContent = "Bật CDN";
  }
}

function renderCards() {
  metricsGrid.innerHTML = images
    .map(
      (image) => `
      <div class="metric-card" data-image="${image.name}">
        <h3>${image.name}</h3>
        <div class="metric-row">
          <span class="card-mode">${state.cdnEnabled ? "CDN bật" : "CDN tắt"}</span>
          <span class="metric-detail">Kích thước: ${image.size} | CF-Cache-Status: --</span>
        </div>
        <p class="metric-time">-- ms</p>
        <div class="metric-bar">
          <div class="metric-bar-inner" style="width: 4%"></div>
        </div>
      </div>`
    )
    .join("");
}

function formatTime(ms) {
  return `${ms.toFixed(0)} ms`;
}

function getBarWidth(ms) {
  const width = 100 - Math.min(90, Math.max(0, ms - 40));
  return Math.max(8, Math.min(100, width));
}

function getImageUrl(image) {
  const base = state.cdnEnabled ? BASE_CDN : BASE_NO_CDN;
  return `${base}/images/${image.src}?t=${Date.now()}`;
}

async function measureImage(image) {
  const url = getImageUrl(image);
  const start = performance.now();
  const response = await fetch(url);
  await response.blob();
  const end = performance.now();
  return { time: end - start, headers: response.headers, url };
}

function updateCard(card, result) {
  const actualMs = result.time;
  const barWidth = getBarWidth(actualMs);
  card.querySelector(".metric-time").textContent = formatTime(actualMs);
  card.querySelector(".metric-bar-inner").style.width = `${barWidth}%`;
  const cacheStatus = result.headers.get('cf-cache-status') || 'N/A';
  card.querySelector(
    ".metric-row"
  ).innerHTML = `<span class="card-mode">${state.cdnEnabled ? "CDN bật" : "CDN tắt"}</span><span class="metric-detail">Thực tế: ${formatTime(actualMs)} | CF-Cache-Status: ${cacheStatus}</span>`;
}

async function runTest() {
  runTestButton.disabled = true;
  toggleButton.disabled = true;
  runTestButton.textContent = "Đang kiểm tra...";

  const cards = Array.from(metricsGrid.querySelectorAll(".metric-card"));

  for (const card of cards) {
    const imageName = card.dataset.image;
    card.querySelector(".metric-time").textContent = "Đang tải...";
    card.querySelector(".metric-bar-inner").style.width = "8%";
  }

  for (const image of images) {
    const card = metricsGrid.querySelector(`[data-image="${image.name}"]`);
    try {
      const actualMs = await measureImage(image);
      updateCard(card, actualMs);
    } catch (error) {
      card.querySelector(".metric-time").textContent = "Lỗi tải";
      card.querySelector(".metric-row").innerHTML = `<span class="card-mode">${state.cdnEnabled ? "CDN bật" : "CDN tắt"}</span><span class="metric-detail">Không tải được: ${error.message}</span>`;
      console.error("Fetch error for image:", error, image, getImageUrl(image));
    }
  }

  runTestButton.textContent = "Chạy kiểm tra";
  toggleButton.disabled = false;
  runTestButton.disabled = false;
}

function toggleCdn() {
  state.cdnEnabled = !state.cdnEnabled;
  updateStatus();
  renderCards();
}

window.addEventListener("DOMContentLoaded", () => {
  updateStatus();
  renderCards();
  toggleButton.addEventListener("click", toggleCdn);
  runTestButton.addEventListener("click", runTest);
});
