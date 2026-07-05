document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  const portfolioDetails = document.getElementById('portfolio-details');
  const showGalleryButton = document.querySelector('.show-gallery-button');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const mainPortfolioImage = document.querySelector('.portfolio-main-image');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-grid .portfolio-card img'));
  const portfolioImages = mainPortfolioImage ? [mainPortfolioImage, ...galleryImages] : galleryImages;
  let activeImageIndex = 0;
  let startX = 0;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    if (!portfolioImages.length) return;
    activeImageIndex = index;
    const image = portfolioImages[activeImageIndex];
    if (!image) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt || 'Imagem do portfólio';
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('visible');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    if (!portfolioImages.length) return;
    const nextIndex = (activeImageIndex + direction + portfolioImages.length) % portfolioImages.length;
    openLightbox(nextIndex);
  };

  if (portfolioDetails && showGalleryButton) {
    const openGallery = (event) => {
      if (event) event.preventDefault();
      portfolioDetails.classList.add('visible');
      portfolioDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (portfolioImages.length > 0) {
        openLightbox(0);
      }
    };

    showGalleryButton.addEventListener('click', openGallery);

    const mainPortfolioCard = document.querySelector('.portfolio-main-card');

    if (mainPortfolioImage) {
      mainPortfolioImage.addEventListener('click', openGallery);
    }

    if (mainPortfolioCard) {
      mainPortfolioCard.addEventListener('click', (event) => {
        if (event.target !== showGalleryButton && event.target !== mainPortfolioImage) {
          openGallery(event);
        }
      });
    }
  }

  if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
    portfolioImages.forEach((image, index) => {
      image.style.cursor = 'zoom-in';
      image.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (event) => {
      const endX = event.changedTouches[0].clientX;
      const delta = endX - startX;
      if (delta > 50) {
        navigateLightbox(-1);
      } else if (delta < -50) {
        navigateLightbox(1);
      }
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('visible')) return;
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        navigateLightbox(1);
      } else if (event.key === 'ArrowLeft') {
        navigateLightbox(-1);
      }
    });
  }
});
