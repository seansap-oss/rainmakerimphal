/**
 * RAINMAKER — Main Script
 * Hardware-accelerated animations, 60fps locked
 */

(function () {
  'use strict';

  // --- DOM References ---
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navLinks = navDrawer.querySelectorAll('.nav-drawer__link');
  const guestlistForm = document.getElementById('guestlistForm');

  // --- Header Scroll Tracking ---
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // --- Navigation Drawer ---
  let isNavOpen = false;

  function openNav() {
    isNavOpen = true;
    navDrawer.classList.add('open');
    navDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    isNavOpen = false;
    navDrawer.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function toggleNav() {
    if (isNavOpen) {
      closeNav();
    } else {
      openNav();
    }
  }

  menuToggle.addEventListener('click', toggleNav);

  // Close on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
    });
  });

  // Close on backdrop click
  navDrawer.addEventListener('click', function (e) {
    if (e.target === navDrawer) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isNavOpen) {
      closeNav();
    }
  });


  // --- Scroll Reveal (IntersectionObserver) ---
  function initScrollReveal() {
    var revealElements = document.querySelectorAll(
      '.about__heading, .about__text, .about__stats, ' +
      '.events__header, .event-card, ' +
      '.lounge-feature, ' +
      '.dining-showcase__intro, .dining-showcase__columns, .dining-showcase__visual, ' +
      '.vip__content, .vip__visual, ' +
      '.guestlist__heading, .guestlist__text, .guestlist__form, ' +
      '.footer__top, .footer__bottom'
    );

    revealElements.forEach(function (el) {
      el.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  // --- Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = header.offsetHeight + 20;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });


  // --- Guestlist Form ---
  if (guestlistForm) {
    guestlistForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = guestlistForm.querySelectorAll('.guestlist__input');
      var btn = guestlistForm.querySelector('.btn');
      var originalText = btn.textContent;

      btn.textContent = 'SENT';
      btn.style.background = '#2d5a2d';
      btn.style.borderColor = '#2d5a2d';

      inputs.forEach(function (input) {
        input.value = '';
      });

      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 2500);
    });
  }


  // --- Event Card Tilt Effect (subtle) ---
  function initCardTilt() {
    var cards = document.querySelectorAll('.event-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -2;
        var rotateY = (x - centerX) / centerX * 2;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.01)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }


  // --- Lounge Feature Hover Effect ---
  function initLoungeHover() {
    var features = document.querySelectorAll('.lounge-feature');

    features.forEach(function (feature) {
      feature.addEventListener('mousemove', function (e) {
        var rect = feature.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -1.5;
        var rotateY = (x - centerX) / centerX * 1.5;

        feature.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      feature.addEventListener('mouseleave', function () {
        feature.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }


  // --- Hero Multi-Video Crossfade Controller ---
  function initHeroVideo() {
    var videos = document.querySelectorAll('.hero__video');
    var progressBar = document.getElementById('heroProgress');
    if (videos.length < 2) return;

    // Ken Burns effect pool
    var kenBurnsEffects = ['kb-zoom-in', 'kb-zoom-out', 'kb-pan-left', 'kb-pan-right'];

    var currentIndex = 0;
    var cycleDuration = 6000;
    var fadeDuration  = 1800;
    var isFading      = false;
    var progressTick  = null;
    var cycleTimer    = null;

    // Assign a random Ken Burns class to each video on load
    videos.forEach(function (vid) {
      var effect = kenBurnsEffects[Math.floor(Math.random() * kenBurnsEffects.length)];
      vid.classList.add(effect);
    });

    // Ensure first video plays
    videos[0].play().catch(function () {});

    // Progress bar
    function startProgress() {
      var startTime = Date.now();
      if (progressTick) cancelAnimationFrame(progressTick);

      function tick() {
        var elapsed = Date.now() - startTime;
        var pct = Math.min((elapsed / cycleDuration) * 100, 100);
        if (progressBar) progressBar.style.width = pct + '%';
        if (pct < 100) {
          progressTick = requestAnimationFrame(tick);
        }
      }
      progressTick = requestAnimationFrame(tick);
    }

    // Crossfade to next video
    function transitionToNext() {
      if (isFading) return;
      isFading = true;

      var outgoing = videos[currentIndex];
      var nextIndex = (currentIndex + 1) % videos.length;
      var incoming = videos[nextIndex];

      // Prep incoming: reset to start, begin playing
      incoming.currentTime = 0;
      incoming.play().catch(function () {});

      // Swap Ken Burns effect on incoming
      kenBurnsEffects.forEach(function (cls) { incoming.classList.remove(cls); });
      var newEffect = kenBurnsEffects[Math.floor(Math.random() * kenBurnsEffects.length)];
      incoming.classList.add(newEffect);

      // Reset animation for fresh Ken Burns
      incoming.style.animation = 'none';
      void incoming.offsetHeight;
      incoming.style.animation = '';

      // CROSSFADE: add is-active to incoming (transitions opacity 0→1)
      incoming.classList.add('is-active');

      // After transition completes, remove is-active from outgoing
      setTimeout(function () {
        outgoing.classList.remove('is-active');

        // Reset outgoing Ken Burns for next use
        kenBurnsEffects.forEach(function (cls) { outgoing.classList.remove(cls); });
        var resetEffect = kenBurnsEffects[Math.floor(Math.random() * kenBurnsEffects.length)];
        outgoing.classList.add(resetEffect);

        currentIndex = nextIndex;
        isFading = false;
        startProgress();
      }, fadeDuration);
    }

    // Kick off
    startProgress();
    cycleTimer = setInterval(transitionToNext, cycleDuration);

    // Pause when hero is out of view, resume when back
    var heroEl = document.getElementById('hero');
    if (heroEl && 'IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!cycleTimer) {
              cycleTimer = setInterval(transitionToNext, cycleDuration);
              startProgress();
            }
            videos.forEach(function (v) { v.play().catch(function () {}); });
          } else {
            if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
            if (progressTick) { cancelAnimationFrame(progressTick); progressTick = null; }
            videos.forEach(function (v) { v.pause(); });
          }
        });
      }, { threshold: 0.1 });
      heroObserver.observe(heroEl);
    }

    // --- Parallax on scroll ---
    var heroContent = document.querySelector('.hero__content');
    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      var heroHeight = window.innerHeight;

      if (scrollY < heroHeight) {
        var progress = scrollY / heroHeight;
        if (heroContent) {
          heroContent.style.transform = 'translate3d(0, ' + (scrollY * 0.3) + 'px, 0)';
          heroContent.style.opacity = Math.max(1 - progress * 1.2, 0);
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }


  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', function () {
    initHeroVideo();
    initScrollReveal();
    initCardTilt();
    initLoungeHover();
    updateHeader();
  });

})();
