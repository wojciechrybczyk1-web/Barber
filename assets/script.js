// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll('.section h2, .card, .review, .pricing__group, .about__image, .form');
revealEls.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// Booking form (front-end only – hook up to email/booking system later)
const form = document.getElementById('booking-form');
const msg = form.querySelector('.form__msg');
const dateInput = form.querySelector('[name="date"]');
dateInput.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.value.trim() !== '' && field.checkValidity();
    field.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  const phone = form.phone.value.replace(/\D/g, '');
  if (phone.length < 9) { form.phone.classList.add('invalid'); valid = false; }

  if (!valid) {
    msg.textContent = 'Uzupełnij poprawnie wszystkie pola.';
    msg.className = 'form__msg err';
    return;
  }
  msg.textContent = `Dziękujemy, ${form.name.value.trim()}! Oddzwonimy, aby potwierdzić wizytę.`;
  msg.className = 'form__msg ok';
  form.reset();
});
