/* =========================================================
   De Facto — Workshop "Passou na OAB, e agora?"
   Interações da página
   ========================================================= */
(function () {
  'use strict';

  /* Endpoint de inscrição. Troque pela URL do seu CRM / checkout.
     Enquanto estiver vazio, o formulário apenas valida e mostra
     a mensagem de sucesso, sem enviar nada. */
  var ENDPOINT = '';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Placeholder de imagens ausentes ---------- */
  var placeholders = {
    'paulo-hero.png': 'foto do professor',
    'paulo-professor.png': 'foto do professor',
    'colunas.png': 'colunas do fórum',
    'justica.png': 'estátua da justiça'
  };

  document.querySelectorAll('[data-portrait] img').forEach(function (img) {
    function fallback() {
      var box = img.closest('[data-portrait]');
      if (!box) return;
      var file = (img.getAttribute('src') || '').split('/').pop();
      box.classList.add('portrait--empty');
      box.setAttribute('data-placeholder', placeholders[file] || 'imagem');
      img.remove();
    }
    img.addEventListener('error', fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  /* ---------- Cabeçalho fixo ---------- */
  var header = document.querySelector('.site-header');

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-principal');

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  /* ---------- Revelação ao rolar ---------- */
  var targets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    document.documentElement.classList.add('js-reveal');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Máscara de telefone (BR) ---------- */
  var phone = document.getElementById('telefone');

  function maskPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  phone.addEventListener('input', function () {
    phone.value = maskPhone(phone.value);
  });

  /* ---------- Validação e envio ---------- */
  var form = document.getElementById('form-inscricao');
  var status = form.querySelector('.form-status');
  var submit = form.querySelector('button[type="submit"]');
  var label = submit.querySelector('.btn-label');

  var rules = {
    nome: function (v) {
      if (!v.trim()) return 'Informe seu nome completo.';
      if (v.trim().split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Informe seu e-mail.';
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())) return 'E-mail inválido.';
      return '';
    },
    telefone: function (v) {
      var d = v.replace(/\D/g, '');
      if (!d) return 'Informe seu WhatsApp.';
      if (d.length < 10) return 'Telefone incompleto (DDD + número).';
      return '';
    }
  };

  function showError(field, message) {
    var box = form.querySelector('[data-error-for="' + field.name + '"]');
    if (box) box.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function validate(field) {
    return showError(field, rules[field.name] ? rules[field.name](field.value) : '');
  }

  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener('blur', function () { validate(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-ok');

    var firstInvalid = null;

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (!validate(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var payload = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: '+55' + form.elements.telefone.value.replace(/\D/g, '')
    };

    submit.disabled = true;
    label.textContent = 'Enviando...';

    function done(ok) {
      submit.disabled = !ok;
      label.textContent = ok ? 'Inscrição enviada' : 'Garantir minha vaga';
      status.classList.toggle('is-ok', ok);
      status.textContent = ok
        ? 'Pronto! Enviamos os detalhes do workshop para o seu e-mail e WhatsApp.'
        : 'Não foi possível enviar agora. Tente novamente em instantes.';
      if (ok) form.reset();
    }

    if (!ENDPOINT) {
      window.setTimeout(function () { done(true); }, 600);
      return;
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { done(res.ok); })
      .catch(function () { done(false); });
  });

  /* ---------- Ano do rodapé ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
