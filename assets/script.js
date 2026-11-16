(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: solid background after scrolling */
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* Reels: play while visible, pause when scrolled away, manual play/pause */
  document.querySelectorAll('.reel').forEach((reel) => {
    const video = reel.querySelector('video');
    const button = reel.querySelector('.reel__toggle');
    let userPaused = reduceMotion; // with reduced motion nothing starts on its own

    const sync = () => {
      reel.classList.toggle('is-paused', video.paused);
      button.setAttribute('aria-label', video.paused ? 'Odtwórz film' : 'Zatrzymaj film');
    };
    const play = () => video.play().catch(sync); // autoplay can be blocked (e.g. iOS power saving)

    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    button.addEventListener('click', () => {
      if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
    });
    video.addEventListener('click', () => button.click());

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { if (!userPaused) play(); }
        else if (!video.paused) video.pause();
      }, { threshold: 0.55 }).observe(reel);
    }
    sync();
  });

  /* Gallery lightbox */
  const dialog = document.querySelector('.lightbox');
  const items = [...document.querySelectorAll('.gallery__item[data-caption]')];
  if (dialog && typeof dialog.showModal === 'function' && items.length) {
    const img = dialog.querySelector('img');
    const caption = dialog.querySelector('.lightbox__caption');
    let index = 0;
    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      img.src = item.getAttribute('href');
      img.alt = item.querySelector('img').alt;
      caption.textContent = item.dataset.caption;
    };
    items.forEach((item, i) => item.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
      dialog.showModal();
    }));
    dialog.querySelector('.lightbox__prev').addEventListener('click', () => show(index - 1));
    dialog.querySelector('.lightbox__next').addEventListener('click', () => show(index + 1));
    dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.tagName === 'FIGURE') dialog.close(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    let startX = null;
    dialog.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }
})();
