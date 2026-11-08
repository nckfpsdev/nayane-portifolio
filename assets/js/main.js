/* Nayane Queiroz Marrocos, Psicóloga
   O site funciona sem JavaScript. Este arquivo só:
   1) monta a mensagem do formulário de contato (versão celular) e abre o WhatsApp;
   2) atualiza o ano do rodapé. Nada é enviado nem guardado por este site. */
(function () {
  'use strict';

  var WHATSAPP = '5585999586711';

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var form = document.querySelector('[data-wa-form]');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var nome = String(data.get('nome') || '').trim();
    var formato = String(data.get('formato') || '').trim();
    var mensagem = String(data.get('text') || '').trim();

    var partes = ['Olá, Nayane! Vim pelo seu site' + (nome ? ' e me chamo ' + nome + '.' : '.')];
    if (formato) partes.push('Tenho interesse em atendimento ' + formato + '.');
    if (mensagem) partes.push(mensagem);

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(partes.join(' '));
    var aba = window.open(url, '_blank', 'noopener');
    if (!aba) window.location.href = url; // pop-up bloqueado: abre na mesma aba
  });
})();

/* Vídeo do trajeto até o consultório.
   Só carrega e toca quando aparece na tela (a versão escondida, desktop ou
   celular, nunca baixa). Quem pede menos movimento, ou economia de dados, vê a
   imagem parada e pode tocar pelo botão. O botão também pausa a qualquer momento. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  document.querySelectorAll('[data-trajeto]').forEach(function (fig) {
    var video = fig.querySelector('video');
    var btn = fig.querySelector('.trajeto__toggle');
    if (!video || !btn) return;

    video.muted = true; // exigido pelo iOS para tocar sozinho
    var paused = reduce || saveData; // escolha da pessoa (ou preferência do sistema)
    var visible = false;

    function render() {
      var playing = !video.paused;
      btn.setAttribute('aria-label', playing ? 'Pausar animação do trajeto' : 'Reproduzir animação do trajeto');
      btn.querySelector('use').setAttribute('href', playing ? '#i-pause' : '#i-play');
    }

    function sync() {
      if (visible && !paused) {
        if (video.preload !== 'auto') video.preload = 'auto';
        var p = video.play();
        if (p && p.catch) p.catch(function () { paused = true; render(); });
      } else if (!video.paused) {
        video.pause();
      }
    }

    video.addEventListener('play', render);
    video.addEventListener('pause', render);
    btn.addEventListener('click', function () {
      paused = !video.paused;
      if (!paused) visible = true;
      sync();
      if (paused) video.pause();
    });

    btn.hidden = false;
    render();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.35 }).observe(video);
    } else {
      visible = true;
      sync();
    }
  });
})();

/* Movimento (revelar ao rolar, profundidade no hero, menu ativo).
   Só enfeite: se o JavaScript falhar, ou se a pessoa pedir menos movimento
   no sistema, a página aparece completa e parada. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var root = document.documentElement;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- 1. Revelar ao rolar ---------- */
  // [seletor, tipo, intervalo entre irmãos (ms)]
  var groups = [
    // desktop
    ['.d-pilares__list li', 'up', 90],
    ['.d-sobre__fig img', 'photo', 0],
    ['.d-sobre__txt > h2, .d-sobre__txt > p, .d-sobre__txt > .d-quote, .d-sobre__txt > .d-h3', 'up', 70],
    ['.d-formacao li', 'up', 60],
    ['.d-ajudar__intro > *', 'up', 90],
    ['.d-ajudar__list li', 'up', 70],
    ['.d-como > .d-wrap > h2, .d-como__lead', 'up', 90],
    ['.d-steps li', 'up', 110],
    ['.d-formatos', 'scale', 0],
    ['.d-empresas__panel', 'scale', 0],
    ['.d-consultorio__head > *', 'up', 100],
    ['.d-galeria img', 'photo', 140],
    ['.d-endereco > *', 'up', 110],
    ['.d-faq__intro > *', 'up', 90],
    ['.d-faq__list details', 'up', 60],
    ['.d-cta', 'scale', 0],
    ['.d-cta__txt > h2, .d-cta__txt > p, .d-cta__btns, .d-cta__links', 'up', 110],
    ['.d-footer__grid > *', 'fade', 90],
    // celular
    ['.m-menu .m-item', 'up', 80],
    ['.m-sec > h2, .m-sec > .m-sub, .m-sec > p', 'up', 70],
    ['.m-acc details', 'up', 55],
    ['.m-steps li', 'up', 100],
    ['.m-formatos li', 'up', 80],
    ['.m-empresas', 'scale', 0],
    ['.m-gal img', 'left', 110],
    ['.m-trajeto, .m-endereco, .m-sec > .btn', 'up', 0],
    ['.m-quote, .m-more', 'up', 80],
    ['.m-form > *', 'up', 45],
    ['.m-footer > *', 'fade', 60]
  ];

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }

  if (io) {
    groups.forEach(function (g) {
      var list = document.querySelectorAll(g[0]);
      // o atraso só vale entre irmãos que aparecem juntos: reinicia a cada grupo de pai
      var lastParent = null, n = 0;
      list.forEach(function (el) {
        if (el.hasAttribute('data-reveal')) return;
        if (el.parentNode !== lastParent) { lastParent = el.parentNode; n = 0; }
        el.setAttribute('data-reveal', g[1]);
        // limita o atraso para listas longas não parecerem lentas
        if (g[2]) el.style.setProperty('--d', Math.min(n * g[2], 420) + 'ms');
        n++;
        io.observe(el);
      });
    });
  }

  /* ---------- 2. Rolagem: cabeçalho, menu ativo, profundidade ---------- */
  var header = document.querySelector('.d-header');
  var heroMedia = document.querySelector('.d-hero__media');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.d-nav a'));
  var spy = navLinks.map(function (a) {
    return { a: a, sec: document.querySelector(a.getAttribute('href')) };
  }).filter(function (s) { return s.sec; });
  var floaters = Array.prototype.slice.call(document.querySelectorAll('.d-empresas__flor, .d-cta__flor'));

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    var y = window.pageYOffset || root.scrollTop || 0;
    var vh = window.innerHeight;

    if (header) header.classList.toggle('is-stuck', y > 8);

    if (heroMedia && y < vh * 1.4) heroMedia.style.setProperty('--sy', Math.min(y, 900).toFixed(1));

    // seção ativa no menu: a última cujo topo já passou de 40% da altura da tela
    var ativo = null;
    if (window.innerWidth >= 900) {
      for (var i = 0; i < spy.length; i++) {
        if (spy[i].sec.getBoundingClientRect().top <= vh * 0.4) ativo = spy[i].a;
      }
    }
    spy.forEach(function (s) {
      var on = s.a === ativo;
      if (on !== s.a.classList.contains('is-active')) {
        s.a.classList.toggle('is-active', on);
        if (on) s.a.setAttribute('aria-current', 'location'); else s.a.removeAttribute('aria-current');
      }
    });

    // flores decorativas: deslocamento pequeno em relação ao centro da tela
    floaters.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var mid = r.top + r.height / 2 - vh / 2;
      el.style.setProperty('--py', (mid * -0.08).toFixed(1));
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* ---------- 3. Hero: leve resposta ao mouse (só com mouse de verdade) ---------- */
  if (fine && heroMedia) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var hero = document.querySelector('.d-hero');

    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      heroMedia.style.setProperty('--mx', cx.toFixed(3));
      heroMedia.style.setProperty('--my', cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(loop);
      else raf = 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }
})();
