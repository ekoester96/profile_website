/* ==========================================
   TERMINAL PORTFOLIO — Shared JS
   Boot sequence, typing, transitions
   ========================================== */

(function () {
  'use strict';

  // ── Boot Sequence ─────────────────────────
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
          setTimeout(() => {
            bootScreen.remove();
            revealPage();
          }, 500);
        }, 400);
        return;
      }
      const line = bootMessages[lineIndex];
      bootText.textContent += line + '\n';
      lineIndex++;
      setTimeout(typeLine, 80 + Math.random() * 120);
    }

    typeLine();
  }

  // ── Reveal page content with flicker ──────
  function revealPage() {
    const main = document.querySelector('.terminal-wrapper');
    if (main) {
      main.classList.add('screen-flicker');
      main.style.visibility = 'visible';
    }
    // Start typing animations
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

      setTimeout(() => {
        typeText(el, text, speed);
      }, delay);

      delay += Math.min(text.length * speed, 1200);
    });

    // Reveal non-typed content after typing finishes
    setTimeout(() => {
      document.querySelectorAll('.fade-in-after').forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 150);
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
        // Keep cursor blinking at end
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

        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.classList.add('page-transition');
        overlay.innerHTML = '<div class="glitch-bar"></div>';
        document.body.appendChild(overlay);

        // Glitch the current content
        const wrapper = document.querySelector('.terminal-wrapper');
        if (wrapper) {
          wrapper.style.animation = 'glitch-text 0.3s ease infinite';
          wrapper.style.opacity = '0.5';
        }

        setTimeout(() => {
          overlay.classList.add('active');
        }, 50);

        setTimeout(() => {
          window.location.href = href;
        }, 500);
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
        span.style.transition = `opacity 0.15s ease ${1.5 + i * 0.06}s`;
        art.appendChild(span);

        setTimeout(() => {
          span.style.opacity = '1';
        }, 50);
      });
    });
  }

  // ── Init ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Hide main content until boot finishes
    const main = document.querySelector('.terminal-wrapper');
    if (main && document.querySelector('.boot-screen')) {
      main.style.visibility = 'hidden';
    }

    runBoot();
    setupTransitions();
    setupAsciiReveal();

    // Add fade-in-after default styles
    document.querySelectorAll('.fade-in-after').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
  });
})();