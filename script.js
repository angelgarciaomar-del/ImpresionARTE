/* =========================================================
   impresionARTE — script.js
   Menú móvil, scroll, galería con lightbox, contador y
   formulario de contacto conectado a WhatsApp.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '5219991436314'; // 52 (México) + 1 + 10 dígitos

  /* ---------------------------------------------------------
     1) Año actual en el footer
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     2) Menú móvil (hamburguesa)
  --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  function closeMenu() {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Cierra el menú al hacer clic en un enlace
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cierra el menú si se agranda la ventana a escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---------------------------------------------------------
     3) Resaltar enlace de navegación activo al hacer scroll
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function highlightNav() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ---------------------------------------------------------
     4) Botón "volver arriba" + sombra de header al hacer scroll
  --------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  const header = document.getElementById('header');

  function handleScroll() {
    const scrolled = window.scrollY > 400;
    if (scrollTopBtn) scrollTopBtn.classList.toggle('is-visible', scrolled);
    if (header) header.style.boxShadow = window.scrollY > 10 ? '0 4px 0 rgba(17,17,17,0.08)' : 'none';
    highlightNav();
    animateStatsIfVisible();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     5) Contador animado de estadísticas (sección "Nosotros")
  --------------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat__num');
  let statsAnimated = false;

  function animateStatsIfVisible() {
    if (statsAnimated || statNums.length === 0) return;

    const aboutSection = document.getElementById('nosotros');
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;

    if (isVisible) {
      statsAnimated = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.count, 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current;
        }, 30);
      });
    }
  }

  /* ---------------------------------------------------------
     6) Galería con lightbox
  --------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(imgSrc, imgAlt, caption) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img.src, img.alt, item.dataset.caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------------------------------------------------------
     7) Formulario de contacto → valida y envía por WhatsApp
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    const wrapper = field ? field.closest('.field') : null;

    if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateForm(data) {
    let valid = true;

    if (!data.nombre.trim()) {
      setError('nombre', 'Escribe tu nombre.');
      valid = false;
    } else {
      setError('nombre', '');
    }

    if (!data.contacto.trim()) {
      setError('contacto', 'Déjanos un teléfono o correo.');
      valid = false;
    } else {
      setError('contacto', '');
    }

    if (!data.mensaje.trim()) {
      setError('mensaje', 'Cuéntanos qué necesitas.');
      valid = false;
    } else {
      setError('mensaje', '');
    }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        nombre: document.getElementById('nombre').value,
        contacto: document.getElementById('contactoUsuario').value,
        servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value,
      };

      if (!validateForm(data)) {
        formNote.textContent = 'Revisa los campos marcados en rojo.';
        formNote.style.color = '#E8192C';
        return;
      }

      const texto =
        `Hola impresionARTE, soy ${data.nombre}.%0A` +
        `Servicio: ${data.servicio || 'No especificado'}%0A` +
        `Contacto: ${data.contacto}%0A` +
        `Mensaje: ${data.mensaje}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

      formNote.textContent = 'Abriendo WhatsApp para enviar tu mensaje...';
      formNote.style.color = '#0057D9';

      window.open(url, '_blank', 'noopener');
      form.reset();
    });

    // Limpia el error de un campo en cuanto el usuario escribe
    ['nombre', 'contactoUsuario', 'mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const key = id === 'contactoUsuario' ? 'contacto' : id;
          setError(key, '');
        });
      }
    });
  }

});
