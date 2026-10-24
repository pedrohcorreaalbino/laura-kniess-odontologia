/* =========================================================
   Laura Kniess Odontologia Estética — Interações e Animações
   ========================================================= */
(() => {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const mqMobile = window.matchMedia('(max-width: 980px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: Sombra e fundo ao rolar ---------- */
  const onHeaderScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 15);
  };
  onHeaderScroll();
  window.addEventListener('scroll', onHeaderScroll, { passive: true });

  /* ---------- Menu Mobile (Hambúrguer) ---------- */
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  mqMobile.addEventListener('change', (e) => {
    if (!e.matches) setMenu(false);
  });

  /* ---------- Link Ativo na Navegação Conforme o Scroll ---------- */
  const navLinks = [...document.querySelectorAll('.nav__link')];
  const trackedSections = navLinks
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = `#${entry.target.id}`;
        navLinks.forEach((l) => {
          l.classList.toggle('is-active', l.getAttribute('href') === currentId);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    trackedSections.forEach((s) => spy.observe(s));
  }

  /* ---------- Efeito de Scroll: Fade / Opacidade Dinâmica na Foto da Dra. Laura ---------- */
  const fadeElement = document.querySelector('[data-scroll-fade]');
  if (fadeElement && !reduceMotion) {
    let ticking = false;

    const updateScrollFade = () => {
      const rect = fadeElement.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Se estiver totalmente fora da tela, limite os extremos
      if (rect.bottom < 0 || rect.top > windowH) {
        ticking = false;
        return;
      }

      // Calcula o centro do elemento em relação ao centro da janela
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowH / 2;
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const maxDistance = (windowH + rect.height) / 2;

      // Progresso: 1 no centro da tela, decrescendo suavemente para as bordas (mínimo ~0.25)
      const normalized = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)));
      // Curva suave quadrática para transição natural
      const opacity = 0.25 + 0.75 * Math.pow(normalized, 1.2);

      fadeElement.style.setProperty('--scroll-opacity', opacity.toFixed(3));
      ticking = false;
    };

    const onScrollFade = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollFade);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollFade, { passive: true });
    window.addEventListener('resize', onScrollFade, { passive: true });
    updateScrollFade();
  }

  /* ---------- Scroll Reveal com IntersectionObserver ---------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Escalonamento de atraso entre elementos irmãos
    document.querySelectorAll('.cards, .gallery, .details-strip, .accordion').forEach((group) => {
      [...group.querySelectorAll(':scope > .reveal')].forEach((el, i) => {
        el.style.setProperty('--d', `${(i * 0.08).toFixed(2)}s`);
      });
    });

    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        revealer.observe(el);
      }
    });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Ano Atual no Footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
