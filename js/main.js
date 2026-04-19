/* ============================================================
   Marc Dexter P. Vargas — Portfolio JavaScript
   main.js | All interactions and dynamic behavior
   ============================================================ */

/* ─── PAGE LOADER ─── */
window.addEventListener('load', () => {
  // Hide loader after a short delay for visual polish
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    triggerFadeUps(); // Animate visible elements on load
  }, 800);
});


/* ─── SET CURRENT YEAR IN FOOTER ─── */
document.getElementById('currentYear').textContent = new Date().getFullYear();


/* ─── SCROLL EVENTS ─── */
// Update scroll progress bar, nav style, and back-to-top visibility
window.addEventListener('scroll', () => {
  const docEl   = document.documentElement;
  const scrolled = docEl.scrollTop;
  const total    = docEl.scrollHeight - docEl.clientHeight;
  const pct      = (scrolled / total) * 100;

  // Scroll progress bar
  document.getElementById('scrollBar').style.width = pct + '%';

  // Sticky nav background on scroll
  document.getElementById('mainNav').classList.toggle('scrolled', scrolled > 40);

  // Back-to-top button visibility
  document.getElementById('backTop').classList.toggle('visible', scrolled > 300);

  // Trigger fade-up animations
  triggerFadeUps();
});


/* ─── SCROLL-TRIGGERED FADE-UP ANIMATIONS ─── */
function triggerFadeUps() {
  const elements = document.querySelectorAll('.fade-up:not(.visible)');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}

// Run once on load to catch already-visible elements
setTimeout(triggerFadeUps, 120);


/* ─── CURSOR GLOW EFFECT ─── */
const glow = document.getElementById('glow');
document.addEventListener('mousemove', (e) => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});


/* ─── THEME TOGGLE (Dark / Light) ─── */
const themeBtn  = document.getElementById('themeBtn');
let isDark      = true; // Default: dark mode

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
});


/* ─── MOBILE MENU ─── */
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});


/* ─── IMAGE MODAL ─── */
const modal      = document.getElementById('modal');
const modalImg   = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');

function openModal(src, title, desc) {
  modalImg.src            = src;
  modalTitle.textContent  = title;
  modalDesc.textContent   = desc;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal when clicking the dark overlay
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});


/* ─── TOAST NOTIFICATION ─── */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ─── BACK TO TOP ─── */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─── CONTACT FORM → GMAIL COMPOSE ─── */
// Opens Gmail directly in a new tab — works on any device without needing
// a desktop email app installed (unlike mailto: links).
function sendMessage() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('senderEmail').value.trim();
  const subject   = document.getElementById('subject').value.trim();
  const message   = document.getElementById('message').value.trim();

  // Validate — name, email, and message are required
  if (!firstName) {
    showToast('⚠️ Please enter your first name.');
    document.getElementById('firstName').focus();
    return;
  }
  if (!email) {
    showToast('⚠️ Please enter your email address.');
    document.getElementById('senderEmail').focus();
    return;
  }
  if (!message) {
    showToast('⚠️ Please write a message.');
    document.getElementById('message').focus();
    return;
  }

  // Build email content
  const subjectText = subject || 'Portfolio Inquiry';
  const bodyText    = `Hi Marc,\n\nFrom: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}\n`;

  // Open Gmail compose in new tab — works on any browser without email app
  const gmailURL = 'https://mail.google.com/mail/?view=cm'
    + '&to=' + encodeURIComponent('marcdextervargas393@gmail.com')
    + '&su=' + encodeURIComponent(subjectText)
    + '&body=' + encodeURIComponent(bodyText);

  window.open(gmailURL, '_blank');

  // Show success feedback and clear the form
  showToast('✅ Gmail opened — message is ready to send!');
  clearForm();
}

/* ─── CLEAR FORM AFTER SENDING ─── */
function clearForm() {
  document.getElementById('firstName').value   = '';
  document.getElementById('lastName').value    = '';
  document.getElementById('senderEmail').value = '';
  document.getElementById('subject').value     = '';
  document.getElementById('message').value     = '';
}


/* ─── IMAGE SLIDER (Isko Barbers Featured Project) ─── */
(function initSlider() {
  const track   = document.getElementById('barbersSliderTrack');
  const dotsWrap = document.getElementById('barbersSliderDots');

  if (!track) return; // Safety check

  const slides     = track.querySelectorAll('img');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoInterval;

  // Build dot indicators
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  // Arrow button controls
  document.getElementById('sliderPrev')?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAuto();
  });

  document.getElementById('sliderNext')?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAuto();
  });

  // Auto-advance every 3 seconds
  function startAuto() {
    autoInterval = setInterval(() => goToSlide(currentIndex + 1), 3000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  startAuto();
})();
