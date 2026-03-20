/* ========================================
   PORTFOLIO — JavaScript Animations & Interactivity
   Ian Miguel B. Biana
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===========================
  // TYPED TEXT EFFECT (Hero)
  // ===========================
  const typedTextEl = document.getElementById('typedText');
  const phrases = [
    'Computer Engineer',
    'UI / Visual Designer',
    'Video Editor & Motion Designer',
    '3D Modeler',
    'Brand Identity Creator',
    'Creative Technologist'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 60;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before next phrase
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // ===========================
  // SCROLL REVEAL (Intersection Observer)
  // ===========================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===========================
  // NAVBAR — Scroll Effect
  // ===========================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ===========================
  // NAVBAR — Active Link Highlight
  // ===========================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ===========================
  // MOBILE MENU TOGGLE
  // ===========================
  const hamburger = document.getElementById('navHamburger');
  const navLinksMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksMenu.classList.toggle('open');
  });

  // Close menu on link click
  navLinksMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksMenu.classList.remove('open');
    });
  });

  // ===========================
  // ANIMATED COUNTERS
  // ===========================
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        stat.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  }

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ===========================
  // SMOOTH SCROLL (for Safari fallback)
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===========================
  // CONTACT FORM (basic handler)
  // ===========================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="animation: spin-slow 1s linear infinite;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Collect form data
      const formData = new FormData(contactForm);
      // Optional: add a hidden subject line specifically for the email subject
      formData.append('_subject', 'New Message from Portfolio Website!');
      
      // Use Formsubmit AJAX endpoint (Free, no backend required)
      fetch('https://formsubmit.co/ajax/miguelbiana@gmail.com', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Message Sent!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #2e7d32, #4caf50)';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3500);
      })
      .catch(error => {
        submitBtn.innerHTML = 'Error Sending. Try Again!';
        submitBtn.style.background = '#d32f2f';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  }

  // ===========================
  // PARALLAX-STYLE MOUSE MOVE (Hero floating shapes)
  // ===========================
  const heroSection = document.querySelector('.hero');
  const geoElements = document.querySelectorAll('.hero-geo');

  if (heroSection && geoElements.length > 0) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;

      geoElements.forEach((el, i) => {
        const factor = (i + 1) * 12;
        el.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    });
  }

  // Images are loaded from the /images/ directory — no placeholders needed.

  // ===========================
  // SKILL CARD TILT EFFECT
  // ===========================
  const skillCards = document.querySelectorAll('.skill-card');

  skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===========================
  // PROJECT CARD MAGNETIC HOVER
  // ===========================
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ===========================
  // IMAGE CAROUSEL
  // ===========================
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const nextButton = carousel.querySelector('.next-btn');
    const prevButton = carousel.querySelector('.prev-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    
    if (dotsContainer && slides.length > 1) {
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          moveToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
      });
    }
    
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
    
    function moveToSlide(index) {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
      }
      currentIndex = index;
    }
    
    if (nextButton && slides.length > 1) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        moveToSlide(nextIndex);
      });
    }
    
    if (prevButton && slides.length > 1) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        moveToSlide(prevIndex);
      });
    }
  });

});
