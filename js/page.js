(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  toggle?.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation?.classList.contains('open')) {
      navigation.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus();
    }
  });
  const slider = document.querySelector('.slideshow');
  if (slider) {
    const slides = [...slider.querySelectorAll('.slide')];
    const dots = [...slider.querySelectorAll('.slide-dots button')];
    const pause = slider.querySelector('.pause');
    const reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    let current = 0, timer, paused = reducedMotion ? reducedMotion.matches : false;
    function show(index, announce = false) {
      const previous = current;
      const direction = index > previous ? 1 : -1;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.classList.toggle('active', i === current); slide.setAttribute('aria-hidden', String(i !== current)); });
      // Move only the incoming and outgoing frames; all other frames stay hidden.
      slides.forEach(slide => { slide.slideAnimation?.cancel(); });
      if (previous !== current && !reducedMotion?.matches && slides[current].animate) {
        const options = { duration: 650, easing: 'cubic-bezier(.22,.61,.36,1)' };
        slides[previous].slideAnimation = slides[previous].animate([
          { transform: 'translateX(0)', visibility: 'visible' },
          { transform: 'translateX(' + (-direction * 100) + '%)', visibility: 'visible' }
        ], options);
        slides[current].slideAnimation = slides[current].animate([
          { transform: 'translateX(' + (direction * 100) + '%)', visibility: 'visible' },
          { transform: 'translateX(0)', visibility: 'visible' }
        ], options);
      }
      dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
      if (announce) slider.querySelector('.slide-status').textContent = `Slide ${current + 1} of ${slides.length}`;
    }
    function schedule() {
      clearInterval(timer);
      if (!paused && !document.hidden) timer = setInterval(() => show(current + 1), 5000);
    }
    function updatePause() { pause.textContent = paused ? 'Play' : 'Pause'; pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow'); schedule(); }
    const go = index => { show(index, true); schedule(); };
    slider.querySelector('.prev').addEventListener('click', () => go(current - 1));
    slider.querySelector('.next').addEventListener('click', () => go(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
    pause.addEventListener('click', () => { paused = !paused; updatePause(); });
    slider.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1)); } });
    let startX = 0, startY = 0;
    slider.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; startY = event.changedTouches[0].clientY; }, { passive: true });
    slider.addEventListener('touchend', event => { const dx = event.changedTouches[0].clientX - startX; const dy = event.changedTouches[0].clientY - startY; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1)); }, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    const motionChanged = event => { paused = event.matches; updatePause(); };
    if (reducedMotion?.addEventListener) reducedMotion.addEventListener('change', motionChanged);
    else if (reducedMotion?.addListener) reducedMotion.addListener(motionChanged);
    show(0); updatePause();
  }
  const photos = [...document.querySelectorAll('.photo')];
  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    photos.forEach(photo => photo.hidden = button.dataset.filter !== 'all' && photo.dataset.category !== button.dataset.filter);
    document.querySelector('.gallery-count').textContent = `${photos.filter(photo => !photo.hidden).length} photographs`;
  }));
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    photos.forEach(photo => photo.addEventListener('click', () => { const image = lightbox.querySelector('img'); image.src = photo.dataset.image; image.alt = photo.querySelector('img').alt; lightbox.querySelector('p').textContent = image.alt; lightbox.showModal(); }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  }
  const form = document.querySelector('.enquiry-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type=submit]'), status = form.querySelector('.form-status');
    button.disabled = true; status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
      const result = await response.json();
      status.textContent = result.message;
      if (response.ok) form.reset();
    } catch { status.textContent = 'Your enquiry could not be sent. Please try again or contact us at kmhns2015@gmail.com.'; }
    finally { button.disabled = false; }
  });
})();
