// Maderas La Isla — site interactions

// === Google Ads conversion helpers ===
// Reemplaza los valores 'AW-18189327422/XXXXX' con los labels reales
// después de crear cada conversión en Google Ads (ver instrucciones).
function gtagReportWhatsAppConversion() {
  if (typeof gtag !== 'function') return;
  gtag('event', 'conversion', {
    send_to: 'AW-18189327422/WHATSAPP_LABEL',
    event_category: 'lead',
    event_label: 'whatsapp_click',
  });
}

function gtagReportFormConversion() {
  if (typeof gtag !== 'function') return;
  gtag('event', 'conversion', {
    send_to: 'AW-18189327422/FORM_LABEL',
    event_category: 'lead',
    event_label: 'contact_form_submit',
  });
}

(() => {
  const navbar = document.querySelector('[data-navbar]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  // Track all WhatsApp clicks across the site (FAB, footer, contact page, etc.)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (link) gtagReportWhatsAppConversion();
  }, true);

  // Scroll-based navbar style
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 30) navbar.classList.add('is-scrolled');
      else navbar.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  // Highlight active nav link based on path
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const target = link.getAttribute('data-nav-link');
    const isHome = target === '/' && (path === '/' || path === '');
    const matches = isHome || (target !== '/' && path.startsWith(target));
    if (matches) link.classList.add('is-active');
  });

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Contact form → opens WhatsApp with prefilled message
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const note = form.querySelector('[data-form-note]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      gtagReportFormConversion();
      const data = new FormData(form);
      const nombre = (data.get('nombre') || '').toString().trim();
      const proyecto = (data.get('proyecto') || '').toString().trim();
      const detalle = (data.get('mensaje') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const telefono = (data.get('telefono') || '').toString().trim();

      const lines = [
        'Hola, soy ' + (nombre || 'un cliente interesado') + '.',
        proyecto ? 'Tipo de proyecto: ' + proyecto : '',
        detalle ? 'Detalle: ' + detalle : '',
        email ? 'Email: ' + email : '',
        telefono ? 'Teléfono: ' + telefono : '',
        '',
        'Me gustaría solicitar una cotización con Maderas La Isla.',
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const url = 'https://wa.me/51986236836?text=' + text;
      window.open(url, '_blank', 'noopener');
      if (note) note.textContent = 'Te llevaremos a WhatsApp para confirmar tu solicitud.';
    });
  }
})();
