// Theme (light/dark) toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('themeIconSun');
const moonIcon = document.getElementById('themeIconMoon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (sunIcon && moonIcon) {
    sunIcon.hidden = theme === 'dark';
    moonIcon.hidden = theme !== 'dark';
  }
}

const savedTheme = localStorage.getItem('theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// Nav scroll state + scroll progress bar
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = pct + '%';
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Diagram tabs (Architecture / ERD) — used on project detail pages
document.querySelectorAll('.diagram-tabs').forEach((tabGroup) => {
  const tabs = tabGroup.querySelectorAll('.diagram-tab');
  const viewer = tabGroup.nextElementSibling;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.dataset.target;
      viewer.querySelectorAll('img').forEach((img) => {
        img.hidden = img.id !== targetId;
      });
    });
  });
});

// Screenshot lightbox — used on project detail pages
const screenImgs = Array.from(document.querySelectorAll('.screen-img'));
if (screenImgs.length) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + screenImgs.length) % screenImgs.length;
    const img = screenImgs[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.closest('figure').querySelector('figcaption').textContent;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  screenImgs.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
  lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

// Hero banner cursor spotlight + parallax
const heroBanner = document.querySelector('.hero-banner');
const heroBannerImg = document.querySelector('.hero-banner-img');
if (heroBanner && heroBannerImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroBanner.addEventListener('mousemove', (e) => {
    const rect = heroBanner.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    heroBanner.style.setProperty('--mx', `${px * 100}%`);
    heroBanner.style.setProperty('--my', `${py * 100}%`);
    heroBannerImg.style.setProperty('--tx', `${(px - 0.5) * -16}px`);
    heroBannerImg.style.setProperty('--ty', `${(py - 0.5) * -16}px`);
  });
  heroBanner.addEventListener('mouseleave', () => {
    heroBannerImg.style.setProperty('--tx', '0px');
    heroBannerImg.style.setProperty('--ty', '0px');
  });
}

// Hero stats count-up
const countEls = document.querySelectorAll('[data-count-to]');
if (countEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  countEls.forEach((el) => countObserver.observe(el));
} else {
  countEls.forEach((el) => {
    el.textContent = el.dataset.countTo + (el.dataset.suffix || '');
  });
}

// Custom cursor (mouse pointers only, respects reduced motion)
if (
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);
  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button')) {
      cursorRing.classList.add('is-hover');
      cursorDot.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button')) {
      cursorRing.classList.remove('is-hover');
      cursorDot.classList.remove('is-hover');
    }
  });
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '';
    cursorRing.style.opacity = '';
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));
