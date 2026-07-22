document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  const topbar = document.querySelector('.topbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const heroWhatsappBtn = document.getElementById('hero-whatsapp-btn');
  const heroWhatsappMenu = document.getElementById('hero-whatsapp-menu');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCount = document.getElementById('lightbox-count');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const whatsappToggle = document.getElementById('whatsapp-toggle');
  const whatsappMenu = document.getElementById('whatsapp-menu');

  const portfolioImages = Array.from(document.querySelectorAll('.work-card img'));
  let activeImageIndex = 0;
  let startX = 0;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ── Sticky header ── */
  const onScroll = () => {
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav ── */
  const closeNav = () => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
  }

  /* ── Dropdown toggles ── */
  const setupDropdown = (btn, menu, closeOthers) => {
    if (!btn || !menu) return;

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      closeOthers();
      btn.setAttribute('aria-expanded', String(!isOpen));
      menu.hidden = isOpen;
    });
  };

  const closeAllDropdowns = () => {
    [heroWhatsappBtn, whatsappToggle].forEach((btn) => {
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    [heroWhatsappMenu, whatsappMenu].forEach((menu) => {
      if (menu) menu.hidden = true;
    });
  };

  setupDropdown(heroWhatsappBtn, heroWhatsappMenu, closeAllDropdowns);
  setupDropdown(whatsappToggle, whatsappMenu, closeAllDropdowns);

  document.addEventListener('click', closeAllDropdowns);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns();
      closeNav();
    }
  });

  /* ── Scroll reveal ── */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  /* ── Lightbox ── */
  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !lightboxCaption || !portfolioImages.length) return;
    activeImageIndex = index;
    const image = portfolioImages[activeImageIndex];
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt || 'Imagem do portfólio';
    if (lightboxCount) {
      lightboxCount.textContent = `${activeImageIndex + 1} / ${portfolioImages.length}`;
    }
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('visible');
    lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    if (!portfolioImages.length) return;
    const nextIndex = (activeImageIndex + direction + portfolioImages.length) % portfolioImages.length;
    openLightbox(nextIndex);
  };

  if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
    portfolioImages.forEach((image, index) => {
      image.closest('.work-card')?.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);

    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (event) => {
      const delta = event.changedTouches[0].clientX - startX;
      if (delta > 50) navigateLightbox(-1);
      else if (delta < -50) navigateLightbox(1);
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('visible')) return;
      if (event.key === 'Escape') closeLightbox();
      else if (event.key === 'ArrowRight') navigateLightbox(1);
      else if (event.key === 'ArrowLeft') navigateLightbox(-1);
    });
  }
});
