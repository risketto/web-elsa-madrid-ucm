/**
 * ELSA Madrid UCM – main.js
 * Features:
 *  - Sticky navbar: transparent on top of hero, solid when scrolled
 *  - Active nav link based on scroll position (Intersection Observer)
 *  - Mobile menu toggle (hamburger → X)
 *  - Close mobile menu when a link is clicked
 *  - Scroll-reveal animation (IntersectionObserver on .reveal elements)
 *  - Auto-update footer year
 *  - Smooth scroll polyfill for anchor links (CSS handles modern browsers)
 */

(function () {
  'use strict';

  /* ── DOM references ── */
  const header    = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const yearEl    = document.getElementById('currentYear');
  const revealEls = document.querySelectorAll('.reveal');

  /* ──────────────────────────────────────────
     Sticky Navbar
     Adds .header--scrolled class after user
     scrolls past the hero section.
  ────────────────────────────────────────── */
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
      header.classList.remove('header--transparent');
    } else {
      header.classList.remove('header--scrolled');
      header.classList.add('header--transparent');
    }
  }

  // Initialise on load
  header.classList.add('header--transparent');
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });


  /* ──────────────────────────────────────────
     Mobile Menu Toggle
  ────────────────────────────────────────── */
  function openMenu() {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when any nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });


  /* ──────────────────────────────────────────
     Active Nav Link on Scroll
     Uses IntersectionObserver to highlight
     the menu item matching the visible section.
  ────────────────────────────────────────── */
  var activeSection = '';

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
          updateActiveLink(activeSection);
        }
      });
    },
    {
      rootMargin: '-50% 0px -50% 0px', // trigger when section crosses centre
      threshold: 0
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  function updateActiveLink(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }


  /* ──────────────────────────────────────────
     Scroll-Reveal Animation
     Adds .visible class to .reveal elements
     when they enter the viewport.
  ────────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────────────
     Footer – current year
  ────────────────────────────────────────── */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ──────────────────────────────────────────
     Contact form – opens email client
  ────────────────────────────────────────── */
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameField = contactForm.querySelector('#name');
      var emailField = contactForm.querySelector('#email');
      var subjectField = contactForm.querySelector('#subject');
      var messageField = contactForm.querySelector('#message');

      var name = nameField ? nameField.value.trim() : '';
      var email = emailField ? emailField.value.trim() : '';
      var subject = subjectField ? subjectField.value.trim() : '';
      var message = messageField ? messageField.value.trim() : '';

      var safeSubject = encodeURIComponent(subject || 'Contacto desde web ELSA Madrid UCM');
      var body = encodeURIComponent(
        'Nombre: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        message
      );

      window.location.href = 'mailto:complutense@es.elsa.org?subject=' + safeSubject + '&body=' + body;
    });
  }

})();
