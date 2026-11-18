(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Mobile menu
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Scroll reveal (skipped for reduced motion or no IntersectionObserver)
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  // Inquiry form: emails mitch@rolams.com through FormSubmit (https://formsubmit.co).
  var form = document.getElementById('inquiry');
  var note = document.getElementById('form-note');
  var btn = form.querySelector('button[type="submit"]');
  function show(msg, ok, html) {
    note.className = 'form__note ' + (ok ? 'form__note--ok' : 'form__note--err');
    if (html) { note.innerHTML = msg; } else { note.textContent = msg; }
    note.hidden = false;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';
    note.hidden = true;
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    fetch('https://formsubmit.co/ajax/mitch@rolams.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.ok && (j.success === true || j.success === 'true')) {
          form.reset();
          show('Thank you! Your inquiry is on its way, and Mitch will be in touch soon.', true);
        } else { throw new Error('bad response'); }
      });
    }).catch(function () {
      show('Sorry, that didn\u2019t go through. Please email <a href="mailto:mitch@rolams.com">mitch@rolams.com</a> directly.', false, true);
    }).then(function () { btn.disabled = false; btn.textContent = label; });
  });
})();
