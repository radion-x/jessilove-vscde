const reveals = document.querySelectorAll('.reveal');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el, index) => {
    const delay = Math.min(index * 80, 400);
    el.style.transitionDelay = `${delay}ms`;
    observer.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
const hero = document.querySelector('.hero');

const setActiveNav = () => {
  const links = document.querySelectorAll('.nav-links a[href]');
  if (!links.length) return;

  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('http') || href.startsWith('#')) return;

    const target = href.split('/').pop() || href;
    const isActive = target === current || (current === '' && target === 'index.html');

    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

setActiveNav();

const setNavOpen = (open) => {
  if (!header || !navToggle) return;
  header.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
};

if (header && navToggle && primaryNav) {
  const setScrollState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  setScrollState();
  window.addEventListener('scroll', setScrollState, { passive: true });

  if (hero) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        header.classList.toggle('on-hero', entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.12 }
    );
    heroObserver.observe(hero);
  }

  navToggle.addEventListener('click', () => {
    const open = !header.classList.contains('nav-open');
    setNavOpen(open);
  });

  primaryNav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link) setNavOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setNavOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setNavOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setNavOpen(false);
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');
const filterPills = document.querySelectorAll('.filter-pill');

if (lightbox && lightboxImage && lightboxClose && galleryItems.length) {
  const supportsDialog = typeof lightbox.showModal === 'function';

  const openLightbox = (href, altText) => {
    if (!supportsDialog) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    lightboxImage.src = href;
    lightboxImage.alt = altText || 'Gallery image';
    lightbox.showModal();
  };

  const closeLightbox = () => {
    if (lightbox.open) lightbox.close();
    lightboxImage.removeAttribute('src');
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const href = item.getAttribute('href');
      const img = item.querySelector('img');
      if (!href) return;
      openLightbox(href, img?.getAttribute('alt') || '');
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

if (filterPills.length && galleryItems.length) {
  const setFilter = (value) => {
    filterPills.forEach((pill) => {
      const active = pill.dataset.filter === value;
      pill.classList.toggle('is-active', active);
      pill.setAttribute('aria-pressed', String(active));
    });

    galleryItems.forEach((item) => {
      const category = item.dataset.category || 'all';
      const hidden = value !== 'all' && category !== value;
      item.classList.toggle('is-hidden', hidden);
    });
  };

  filterPills.forEach((pill) => {
    pill.setAttribute('aria-pressed', String(pill.classList.contains('is-active')));
    pill.addEventListener('click', () => setFilter(pill.dataset.filter || 'all'));
  });

  const initial = document.querySelector('.filter-pill.is-active')?.dataset.filter || 'all';
  setFilter(initial);
}
