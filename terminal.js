/* ==========================================
   TERMINAL PORTFOLIO — Shared JS
   Boot sequence, typing, transitions,
   ASCII character plasma background
   ========================================== */

(function () {
  'use strict';

  // ── ASCII Plasma Background ───────────────
  // Uses terminal density characters: . - = + * # @ $
  // Drawn on canvas for guaranteed full-screen coverage
  function initPlasma() {
    const canvas = document.createElement('canvas');
    canvas.id = 'plasma-bg';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;opacity:0.14;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    const chars = ' .-=+*$#@';
    const cellW = 10;
    const cellH = 16;
    let cols, rows, time = 0;

    // Get accent color
    const style = getComputedStyle(document.body);
    const accent = style.getPropertyValue('--accent').trim() || '#ffffff';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / cellW) + 1;
      rows = Math.ceil(canvas.height / cellH) + 1;
    }
    resize();
    window.addEventListener('resize', resize);

    function render() {
      time += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px VT323, monospace';
      ctx.fillStyle = accent;
      ctx.textBaseline = 'top';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v1 = Math.sin(x * 0.04 + time);
          const v2 = Math.sin(y * 0.05 + time * 0.7);
          const v3 = Math.sin((x + y) * 0.03 + time * 0.5);
          const v4 = Math.sin(Math.sqrt(x * x * 0.3 + y * y * 0.3) * 0.04 + time * 0.9);
          const v = (v1 + v2 + v3 + v4 + 4) / 8;
          const idx = Math.floor(v * (chars.length - 1));
          ctx.fillText(chars[idx], x * cellW, y * cellH);
        }
      }

      requestAnimationFrame(render);
    }
    render();
  }

  // ── Boot Sequence (landing only) ──────────
  const bootMessages = [
    'BIOS v3.14 ... OK',
    'Memory check ... 640K ought to be enough',
    'Detecting drives ... /dev/sda1',
    'Loading kernel .........',
    'Mounting filesystem ... OK',
    'Starting terminal session ...',
    '',
    'Welcome, visitor.',
    ''
  ];

  function runBoot() {
    const bootScreen = document.querySelector('.boot-screen');
    if (!bootScreen) { revealPage(); return; }
    const bootText = bootScreen.querySelector('.boot-text');
    let lineIndex = 0;

    function typeLine() {
      if (lineIndex >= bootMessages.length) {
        setTimeout(() => {
          bootScreen.classList.add('fade-out');
          setTimeout(() => { bootScreen.remove(); revealPage(); }, 500);
        }, 400);
        return;
      }
      bootText.textContent += bootMessages[lineIndex] + '\n';
      lineIndex++;
      setTimeout(typeLine, 80 + Math.random() * 120);
    }
    typeLine();
  }

  function revealPage() {
    const main = document.querySelector('.terminal-wrapper');
    if (main) {
      main.classList.add('screen-flicker');
      main.style.visibility = 'visible';
    }
    setTimeout(typeAllContent, 600);
  }

  // ── Typing Animation ─────────────────────
  function typeAllContent() {
    const elements = document.querySelectorAll('.type-me');
    let delay = 0;
    elements.forEach((el) => {
      const text = el.textContent;
      const speed = parseInt(el.dataset.speed) || 20;
      el.textContent = '';
      el.classList.add('revealed');
      el.style.visibility = 'visible';
      setTimeout(() => { typeText(el, text, speed); }, delay);
      delay += Math.min(text.length * speed, 1200);
    });
    setTimeout(() => {
      document.querySelectorAll('.fade-in-after').forEach((el, i) => {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 150);
      });
    }, delay + 200);
  }

  function typeText(el, text, speed) {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    el.appendChild(cursor);
    function tick() {
      if (i < text.length) {
        cursor.before(document.createTextNode(text[i]));
        i++;
        setTimeout(tick, speed + Math.random() * 15);
      } else {
        setTimeout(() => cursor.remove(), 2000);
      }
    }
    tick();
  }

  // ── Page Transitions ──────────────────────
  function setupTransitions() {
    document.querySelectorAll('.nav-bar a, a.page-link').forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;
        e.preventDefault();
        const overlay = document.createElement('div');
        overlay.classList.add('page-transition');
        overlay.innerHTML = '<div class="glitch-bar"></div>';
        document.body.appendChild(overlay);
        const wrapper = document.querySelector('.terminal-wrapper');
        if (wrapper) {
          wrapper.style.animation = 'glitch-text 0.3s ease infinite';
          wrapper.style.opacity = '0.5';
        }
        setTimeout(() => { overlay.classList.add('active'); }, 50);
        setTimeout(() => { window.location.href = href; }, 500);
      });
    });
  }

  // ── ASCII Art Row-by-Row Reveal ───────────
  function setupAsciiReveal() {
    document.querySelectorAll('.ascii-art').forEach((art) => {
      const lines = art.textContent.split('\n');
      art.textContent = '';
      art.style.opacity = '1';
      art.style.animation = 'none';
      lines.forEach((line, i) => {
        const span = document.createElement('div');
        span.textContent = line;
        span.style.opacity = '0';
        span.style.transition = `opacity 0.15s ease ${0.8 + i * 0.06}s`;
        art.appendChild(span);
        setTimeout(() => { span.style.opacity = '1'; }, 50);
      });
    });
  }

  // ── Init ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initPlasma();

    const main = document.querySelector('.terminal-wrapper');
    const bootScreen = document.querySelector('.boot-screen');

    if (main && bootScreen) {
      main.style.visibility = 'hidden';
      runBoot();
    } else if (main) {
      main.style.visibility = 'hidden';
      setTimeout(revealPage, 100);
    }

    setupTransitions();
    setupAsciiReveal();

    document.querySelectorAll('.fade-in-after').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
  });
})();