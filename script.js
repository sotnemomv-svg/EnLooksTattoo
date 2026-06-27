document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  const portfolioDetails = document.getElementById('portfolio-details');
  const showGalleryButton = document.querySelector('.show-gallery-button');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const portfolioImages = document.querySelectorAll('.gallery-grid .portfolio-card img');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (portfolioDetails && showGalleryButton) {
    showGalleryButton.addEventListener('click', (event) => {
      event.preventDefault();
      portfolioDetails.classList.add('visible');
      portfolioDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
    portfolioImages.forEach((image) => {
      image.style.cursor = 'zoom-in';
      image.addEventListener('click', () => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.alt || 'Imagem do portfólio';
        lightbox.classList.add('visible');
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      lightboxImage.src = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    });
  }
});
