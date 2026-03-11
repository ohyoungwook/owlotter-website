// === Clock ===
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 30000);

// === Start menu ===
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startMenu.classList.toggle('open');
});

document.addEventListener('click', () => {
  startMenu.classList.remove('open');
});

startMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Start menu links
startMenu.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    openWindow(targetId);
    startMenu.classList.remove('open');
  });
});

// === Window management ===
let topZ = 10;

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'flex';
  bringToFront(win);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
}

function bringToFront(win) {
  topZ++;
  win.style.zIndex = topZ;
  document.querySelectorAll('.win-window').forEach(w => w.classList.add('inactive'));
  win.classList.remove('inactive');
}

// Desktop icon double-click / click
document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    openWindow(icon.dataset.target);
  });
  // Single click on mobile
  icon.addEventListener('click', () => {
    if (window.innerWidth <= 640) {
      openWindow(icon.dataset.target);
    }
  });
});

// Window controls
document.querySelectorAll('.win-btn-close').forEach(btn => {
  btn.addEventListener('click', () => closeWindow(btn.dataset.window));
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeWindow(btn.dataset.close));
});

// Click window to bring to front
document.querySelectorAll('.win-window').forEach(win => {
  win.addEventListener('mousedown', () => bringToFront(win));
});

// Drag windows
document.querySelectorAll('.win-titlebar').forEach(titlebar => {
  let isDragging = false;
  let offsetX, offsetY;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    const win = titlebar.closest('.win-window');
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    bringToFront(win);

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - 40));
      const y = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - 40));
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Touch drag for mobile
  titlebar.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    const win = titlebar.closest('.win-window');
    const touch = e.touches[0];
    offsetX = touch.clientX - win.offsetLeft;
    offsetY = touch.clientY - win.offsetTop;
    bringToFront(win);

    const onTouchMove = (e) => {
      const t = e.touches[0];
      const x = Math.max(0, Math.min(t.clientX - offsetX, window.innerWidth - 40));
      const y = Math.max(0, Math.min(t.clientY - offsetY, window.innerHeight - 40));
      win.style.left = x + 'px';
      win.style.top = y + 'px';
      e.preventDefault();
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  });
});
